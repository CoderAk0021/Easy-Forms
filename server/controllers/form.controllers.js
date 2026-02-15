import Form from "../models/Form.js";
import Response from "../models/Response.js";
import sanitize from "mongo-sanitize";
import mongoose from "mongoose";
import { verifyGoogleToken } from "../utils/googleAuth.js";
import { getMailStatus, sendSubmissionReceipt } from "../utils/mailer.js";

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function handleGetAllForms(req, res) {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function handleGetPublicForm(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid form id" });
    }

    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    if (!form.isPublished) {
      return res.status(403).json({ message: "Form is not published" });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function handleGetSingleForm(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid form id" });
    }

    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function handleCreateNewForm(req, res) {
  try {
    const cleanBody = sanitize(req.body);
    const form = new Form(cleanBody);
    const savedForm = await form.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function handleUpdateForm(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid form id" });
    }

    const cleanBody = sanitize(req.body);
    const form = await Form.findByIdAndUpdate(req.params.id, cleanBody, {
      new: true,
      runValidators: true,
    });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function handleDeleteForm(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid form id" });
    }

    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    await Response.deleteMany({ formId: req.params.id });
    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function handleGetResponseForAForm(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid form id" });
    }

    const responses = await Response.find({ formId: req.params.id }).sort({
      submittedAt: -1,
    });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function handleSubmitAResponse(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid form id" });
    }

    const form = await Form.findById(req.params.id);
    let verifiedEmail = null;
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    if (!form.isPublished) {
      return res.status(403).json({ message: "Form is not published" });
    }
    if (!req.body.googleToken) {
      return res.status(401).json({ message: "Google Sign In Required" });
    }

    verifiedEmail = await verifyGoogleToken(req.body.googleToken);
    if (!verifiedEmail) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    if (!Array.isArray(req.body.answers)) {
      return res.status(400).json({ message: "Answers must be an array" });
    }

    const exists = await Response.findOne({
      formId: req.params.id,
      respondentEmail: String(verifiedEmail).trim().toLowerCase(),
    });

    if (exists && !form.settings.allowMultipleResponses) {
      return res
        .status(409)
        .json({ message: "You have already submitted this form." });
    }

    const response = new Response({
      formId: req.params.id,
      answers: sanitize(req.body.answers),
      respondentEmail: String(verifiedEmail).trim().toLowerCase(),
    });

    await response.save();
    form.responseCount += 1;
    await form.save();

    const emailSettings = form.settings?.emailNotification;
    const shouldSendReceipt = Boolean(
      emailSettings?.enabled &&
        verifiedEmail &&
        typeof verifiedEmail === "string" &&
        verifiedEmail.trim(),
    );

    if (shouldSendReceipt) {
      try {
        const receiptResult = await sendSubmissionReceipt({
          to: String(verifiedEmail).trim().toLowerCase(),
          formTitle: form.title,
          submittedAt: response.submittedAt,
          subjectTemplate: emailSettings?.subject,
          messageTemplate: emailSettings?.message,
        });
        if (!receiptResult?.sent) {
          console.warn(
            `Submission receipt skipped for form ${String(form._id)}: ${receiptResult?.reason || "unknown_reason"}`,
          );
        }
      } catch (mailError) {
        console.error("Failed to send submission receipt:", mailError?.message || mailError);
      }
    }

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function handleCheckStatus(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid form id" });
    }

    const form = await Form.findById(req.params.id).select("isPublished");
    if (!form || !form.isPublished) {
      return res.json({ submitted: false });
    }

    const cleanQuery = sanitize(req.query);
    const email = String(cleanQuery.email || "").trim().toLowerCase();
    const formID = String(req.params.id);
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const response = await Response.findOne({
      formId: formID,
      respondentEmail: email,
    });
    return res.json({ submitted: !!response });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}

export async function handleGetMailStatus(req, res) {
  try {
    return res.json(getMailStatus());
  } catch (error) {
    return res.status(500).json({ message: "Failed to read mail configuration status" });
  }
}

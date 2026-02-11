import express from "express";
import { validate } from '../middlewares/validate.js';
import { createFormSchema } from '../validators/form.validator.js';

import { checkCookies } from "../middlewares/auth.middleware.js";
import {
  handleGetAllForms,
  handleGetSingleForm,
  handleCreateNewForm,
  handleUpdateForm,
  handleDeleteForm,
  handleGetResponseForAForm,
  handleSubmitAResponse,
  handleCheckStatus,
  handleGetPublicForm,
} from "../controllers/form.controllers.js";

const router = express.Router();


// Get all forms
router.get("/", checkCookies, handleGetAllForms);

// Get a public form published
router.get("/public/:id", handleGetPublicForm);

//Get a single form (protected)
router.get('/:id', checkCookies, handleGetSingleForm);

// Create a new form

router.post("/", checkCookies, validate(createFormSchema), handleCreateNewForm);

// Update a form
router.put("/:id", checkCookies, handleUpdateForm);

// Delete a form
router.delete("/:id", checkCookies, handleDeleteForm);

// Get responses for a form
router.get("/:id/responses", checkCookies, handleGetResponseForAForm);

//Submit a response
router.post("/:id/responses", handleSubmitAResponse);

//Check Status of a form submit
router.get("/:id/check-status", handleCheckStatus);

export default router;




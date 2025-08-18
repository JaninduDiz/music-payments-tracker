# AI Feature: Natural Language Payment Search

This document provides an overview of the AI-powered search functionality implemented in this application. The goal of this feature is to allow users to search for payments using simple, natural language questions.

## How it Works

The feature is built using **Genkit**, a framework for building AI-powered applications, which connects to a Google Gemini model to understand and process user queries. The process can be broken down into two main parts: the AI backend flow and the frontend component.

### 1. The AI Backend Flow (`src/ai/flows/payment-query-flow.ts`)

This file contains the core logic for the AI search.

-   **Purpose**: To receive a user's natural language query, along with the current list of members and payments, and return a list of payment IDs that match the query.
-   **Technology**: It uses Genkit to define a "flow," which is a series of steps that the AI will execute.

#### Key Components:

-   **`PaymentQueryInputSchema`**: This defines the expected input for our AI flow using Zod. The flow needs:
    -   `query`: The user's question (e.g., "Show all payments for John Doe").
    -   `members`: A list of all members, so the AI knows who is who.
    -   `payments`: A list of all payments for the AI to search through.

-   **`PaymentQueryOutputSchema`**: This defines the expected output. The flow will return:
    -   `paymentIds`: An array of strings, where each string is the ID of a payment that matches the user's query.

-   **`ai.definePrompt(...)`**: This is the heart of the AI logic. It's a template that instructs the Gemini model on how to behave.
    -   We tell the model that it is an "expert at searching through payment records."
    -   We provide the user's `query`, the list of `members`, and the list of `payments` using Handlebars templating syntax (e.g., `{{query}}`).
    -   We explicitly ask the model to analyze the query, identify member names, and return only the IDs of the matching payments. This structured approach ensures we get reliable results.

-   **`ai.defineFlow(...)`**: This wraps our prompt into a reusable flow named `paymentQueryFlow`. When this flow is called, it executes the prompt with the provided input and returns the result.

-   **`findPaymentsByQuery` function**: This is an exported server action that our frontend can call directly. It simply calls the `paymentQueryFlow` and returns its output.

### 2. The Frontend Component (`src/components/ai/ai-search.tsx`)

This file contains the user interface for the AI search feature.

-   **Purpose**: To provide a search bar for the user to type their question and to display the results.
-   **Technology**: A standard React component using `react-hook-form` for form management.

#### Key Functionality:

-   **The Form**: A simple input field where the user can type their query.
-   **`handleSubmit` function**: When the form is submitted:
    1.  It calls the `findPaymentsByQuery` server action, passing the user's query along with the `members` and `payments` data from our `DataContext`.
    2.  It receives the `paymentIds` from the AI flow.
    3.  If any IDs are returned, it filters the main `payments` list to get the full payment objects.
    4.  It passes these filtered payments to the parent `PaymentsPage` via the `onResults` prop, which then updates the `RecentPayments` component to show only the search results.
    5.  It displays a toast notification to inform the user about the search outcome.

By separating the AI logic into a Genkit flow and the UI into a React component, we create a clean and maintainable feature that is easy to understand and extend in the future.
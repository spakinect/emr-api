---
id: intro
title: Introduction
---

# Introduction to the Spakinect EMR API

This documentation provides a comprehensive guide for **Electronic Medical Record (EMR)** systems to integrate with the **Spakinect platform**. Our API enables seamless data exchange for managing patient records, treatments, and visits.

---

## Getting Started

To begin the integration process, your EMR system must first contact the Spakinect team. Upon registration, we will provide you with a unique API key, which is required for secure authentication on all API requests. 

This key serves as a **secure authentication token** for your system, ensuring that only authorized requests can access our platform.

---

## Staging Environment

For all your testing and development needs, you can use our **staging environment**. This environment is separate from our production system and is designed to allow you to test your integration without affecting live data. Spakinect will provide you a Staging Account along with an  API key.


This key allows you to test all available endpoints, including those for retrieving treatments and creating at-home visits.

---

## Creating new Appointments / In-Person Visits

To successfully test the endpoints, you must provide the **`location_id`** of the specific medspa. This ID can be obtained directly from the **Spakinect client portal**.

By using this location-specific ID, you can successfully test the endpoint and verify your system's integration workflow.


## Patient Matching Logic

When creating a visit, Spakinect determines whether to **create a new patient** or **associate the visit with an existing patient** based on the following criteria:

- **In-Person Visits:** Matching is done using a combination of **first name**, **last name**, and **date of birth**.  
- **At-Home Visits:** Matching is done using a combination of **first name**, **last name**, and **email**.

If a matching patient record already exists in the system, the visit will be linked to that patient.  
Otherwise, a **new patient record** will be created automatically.
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

For all your testing and development needs, you can use our **staging environment**. This environment is separate from our production system and is designed to allow you to test your integration without affecting live data.

You can use the following universal API key for all your testing purposes:

`E4kBuUHs-uuU0-7f9x-ktzs-dkmG1ScItgU3`

This key allows you to test all available endpoints, including those for retrieving treatments and creating at-home visits.

---

## Creating an At Home Visit

To successfully test the "Create an At Home Visit" endpoint, you must provide the **`location_id`** of the specific medspa. This ID can be obtained directly from the **Spakinect client portal**.

By using this location-specific ID, you can successfully test the endpoint and verify your system's integration workflow for at-home visits.
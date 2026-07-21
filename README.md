# Meridian Pay — Secure CI/CD Pipeline

# Video Walkthrough: https://somup.com/cOirVnVnwN7 
## Project Summary

This project implements a SOC 2 compliant CI/CD pipeline for Meridian Pay, a fictional fintech application. Built as part of CST 365 DevOps and CI/CD at Concordia University St. Paul, it demonstrates supply chain security best practices using automated vulnerability scanning, software bill of materials generation, and cryptographic image signing.

## What This Pipeline Does

Every push to main triggers a GitHub Actions workflow that:

1. Builds a Docker container image from the application source
2. Scans the image for vulnerabilities using **Trivy**
3. Generates a **Software Bill of Materials (SBOM)** using Syft
4. Signs the image cryptographically using **Cosign** (keyless signing via Sigstore)

## Tech Stack

- **GitHub Actions** — CI/CD automation
- **Docker** — Container image build
- **Trivy** — Vulnerability scanning
- **Syft** — SBOM generation
- **Cosign** — Container image signing (Sigstore)
- **Node.js / JavaScript** — Application runtime

## Why This Matters

SOC 2 compliance requires organizations to demonstrate that software is built, verified, and deployed securely. This pipeline automates those controls so every release is scanned, documented, and signed without manual steps — reducing human error and creating an auditable record of every build.

## Repository Structure

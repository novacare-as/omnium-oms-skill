# Test & Dev

Source: https://docs.omnium.no/docs/Environments/test-dev

We provide separate environments for development and testing. These let you test new features early and validate upcoming releases before they go live in production.

**Heads up**: Our new Dev environment is fresh out of the oven 🍞
It may still have a few quirks - let us know if you spot anything.

Below are frequently asked questions about our Dev and Test environments.

## What is the purpose of the Dev and Test environments?

**Dev** (dev.omnium.no / apidev.omnium.no) is continuously updated with the latest changes from our developers.

**Test** (test.omnium.no / apitest.omnium.no) reflects the upcoming release to production and is therefore a stable environment for release validation.

## Why do we provide both environments?

*   To let you test new functionality as soon as it is implemented.
*   To ensure that you have a stable environment that mirrors the next production release.

## How often are they updated?

*   **Dev** is updated continuously.
*   **Test** is updated each Tuesday, after the latest release has been deployed to production.

## Where can I see what is currently in Test?

The Test environment always contains the **Upcoming Release** documented in our [release notes](../Releasenotes.md).

**Example:** If the release notes show Upcoming Release: 31, that is what runs in Test. When it goes live in production the following Tuesday, Release 32 will then be promoted to Test.

## Do Dev and Test share the same data?

Yes, for simplicity both environments share the same data (including API users), **except for settings**.

## Tips for using Dev and Test environments

*   Since Dev and Test share the same data, we recommend that scheduled tasks only run in one of the environments to avoid duplicate processing.

*   You may copy settings from one environment to another. This will override ALL settings (but scheduled tasks will be automatically set to disabled), so use with care. For safety reasons, this option is only available in dev and test - not in production.

![Copy tenant settings](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcopy_tenant_settings.bf4afbbf.png&w=3840&q=75)

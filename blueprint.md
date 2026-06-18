# Project Blueprint

## Overview

This Angular + Node.js/Express application provides a blog platform with various tools and capabilities, including authentication, admin features, a chatbot, and specialized converters (JSON to TS, Image Converter).

## Established Capabilities

- Standalone Angular Components with `ChangeDetectionStrategy.OnPush`.
- Signals for reactive state management.
- Native control flow (`@if`, `@for`).
- Node.js/Express backend with MongoDB.
- JWT-based Auth system with refresh tokens.

## Current Request: BlogCreateComponent Modernization

### Goal

Modernize the `BlogCreateComponent` to use a highly user-friendly, premium design with Tailwind CSS, replacing the legacy CSS and adopting the latest Angular v20+ features.

### Plan

1. **Refactor Logic**: Adopt `inject()`, Signals, and `OnPush` detection strategy.
2. **Redesign UI**: Implement a premium, grid-based layout with Tailwind CSS.
3. **Enhance Content Editor**: Ensure TinyMCE integration fits the new design aesthetic.
4. **Validation**: Use modern reactive form validation with clear visual feedback.

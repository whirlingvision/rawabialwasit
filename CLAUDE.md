# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a professional multilingual corporate website for Rawabi Alwasit Company, a Saudi Arabian industrial supplies and services company. The site is built using modern web technologies with PHP backend, comprehensive security features, and bilingual support (English/Arabic).

## Architecture & Structure

### Core Technology Stack
- **Frontend**: HTML5, CSS3 (with CSS custom properties), Modern ES6+ JavaScript
- **Backend**: PHP with modern security practices
- **Styling**: Bootstrap-based responsive framework with custom CSS modules
- **Scripts**: Modular JavaScript architecture with performance optimizations

### Key Components
- **Security Layer**: `security-config.php` - Centralized security functions with CSRF protection, rate limiting, input sanitization
- **Contact System**: `form.php` - Secure contact form with validation and email functionality
- **Modern Assets**: 
  - `assets/css/modern-security.css` - Enhanced modern styling
  - `assets/js/modern-app.js` - Modern JavaScript with security and performance features

### Security Architecture
- CSRF token validation for forms
- Rate limiting (3 submissions per 5 minutes)
- Comprehensive input sanitization and XSS protection
- Modern security headers (CSP, HSTS, CORS policies)
- Security event logging system
- Saudi phone number validation patterns

## Development Commands

### Testing & Validation
- **PHP Syntax Check**: `php -l filename.php`
- **Security Headers Test**: Check browser dev tools Network tab after loading pages
- **Form Validation Test**: Test contact form with various inputs including XSS attempts

### File Serving
- **Local Development**: Use PHP built-in server `php -S localhost:8000`
- **Apache Required**: `.htaccess` configured for production Apache environments

## Key Development Patterns

### Security Practices
- Always use `sanitize_input()` function from security-config.php for user inputs
- Implement CSRF tokens for all forms using `generate_csrf_token()` and `validate_csrf_token()`
- Use rate limiting with `check_rate_limit()` for form submissions
- Log security events with `log_security_event()` for monitoring

### Form Handling
- All forms must include CSRF token validation
- Use Saudi phone validation pattern: `/^(\+966|966|0)?[5-9][0-9]{8}$/`
- Email validation uses PHP `FILTER_VALIDATE_EMAIL`
- Implement proper error handling with user-friendly messages

### CSS Architecture
- Use CSS custom properties (variables) defined in modern-security.css
- Follow mobile-first responsive approach
- Support both LTR and RTL layouts for bilingual functionality
- Implement dark mode support with `prefers-color-scheme`

### JavaScript Patterns
- Use debouncing for form validation (300ms delay)
- Implement throttling for scroll events (100ms delay)
- Follow modular architecture with IIFE pattern
- Include proper error handling and graceful degradation

## Bilingual Support
- Website supports English and Arabic languages
- RTL layout support for Arabic content
- Language persistence in localStorage
- Cultural considerations for Saudi Arabian market

## File Organization
- **Root**: HTML pages and PHP scripts
- **assets/css/**: All stylesheets including modern enhancements
- **assets/js/**: JavaScript files with modern-app.js for custom functionality
- **assets/img/**: Images organized by category (about/, services/, etc.)
- **assets/fonts/**: Custom fonts including Arabic support

## Security Considerations
- Never commit sensitive data or API keys
- All user inputs must be sanitized through security-config.php functions
- Rate limiting is enforced on all form submissions
- Security headers are automatically set via security-config.php inclusion
- HTTPS redirects configured in .htaccess

## Content Management
- Company rebrand completed: All references updated to "Rawabi Alwasit Company"
- Contact email: info@rawabialwasit.com
- Phone: +966 58 262 7405
- Comprehensive product and service pages covering industrial supplies, safety equipment, and maintenance services
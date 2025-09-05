<?php
// Include security configuration
require_once 'security-config.php';

$errors = [];
$errorMessage = '';

// Start session for CSRF protection
session_start();

if (!empty($_POST)) {
    // Rate limiting check
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    if (!check_rate_limit($ip, 'contact_form', 3, 300)) {
        log_security_event('rate_limit_exceeded', ['ip' => $ip]);
        $errors[] = 'Too many requests. Please try again later.';
    }
    
    // CSRF token validation
    if (!validate_csrf_token($_POST['csrf_token'] ?? '')) {
        log_security_event('csrf_token_invalid', ['ip' => $ip]);
        $errors[] = 'Invalid security token. Please refresh the page and try again.';
    }
    
    // Sanitize all inputs to prevent HTML injection and XSS
    $name = sanitize_input($_POST['name'] ?? '');
    $email = sanitize_input($_POST['email'] ?? '');
    $phone = sanitize_input($_POST['phone'] ?? '');
    $company = sanitize_input($_POST['company'] ?? '');
    $subject = sanitize_input($_POST['subject'] ?? '');
    $message = sanitize_input($_POST['message'] ?? '');

    // Enhanced validation
    if (empty($name) || strlen($name) < 2) {
        $errors[] = 'Name must be at least 2 characters long';
    }

    if (empty($email)) {
        $errors[] = 'Email is required';
    } else if (!validate_email($email)) {
        $errors[] = 'Please enter a valid email address';
    }

    if (!empty($phone) && !validate_phone($phone)) {
        $errors[] = 'Please enter a valid Saudi phone number';
    }

    if (empty($message) || strlen($message) < 10) {
        $errors[] = 'Message must be at least 10 characters long';
    }
    
    if (strlen($message) > 1000) {
        $errors[] = 'Message is too long (maximum 1000 characters)';
    }

    if (empty($errors)) {
        // Use actual company email instead of example
        $toEmail = 'info@rawabialwasit.com';
        $emailSubject = 'New Contact Form Message - Rawabi Alwasit Company';

        // Secure headers to prevent email injection
        $headers = [
            'From' => 'noreply@rawabialwasit.com',
            'Reply-To' => $email,
            'Content-type' => 'text/html; charset=UTF-8',
            'X-Mailer' => 'PHP/' . phpversion()
        ];

        // Sanitize content for email body to prevent any injection
        $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        $safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
        $safePhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
        $safeCompany = htmlspecialchars($company, ENT_QUOTES, 'UTF-8');
        $safeSubject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
        $safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

        $body = "
        <html>
        <head>
            <title>New Contact Form Message</title>
        </head>
        <body>
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> {$safeName}</p>
            <p><strong>Email:</strong> {$safeEmail}</p>
            <p><strong>Phone:</strong> {$safePhone}</p>
            <p><strong>Company:</strong> {$safeCompany}</p>
            <p><strong>Subject:</strong> {$safeSubject}</p>
            <p><strong>Message:</strong></p>
            <p>{$safeMessage}</p>
        </body>
        </html>
        ";

        if (mail($toEmail, $emailSubject, $body, $headers)) {
            header('Location: contact.html?success=1');
            exit();
        } else {
            $errorMessage = 'Oops, something went wrong. Please try again later';
        }
    } else {
        // Sanitize error messages to prevent HTML injection
        $safeErrors = array_map(function($error) {
            return htmlspecialchars($error, ENT_QUOTES, 'UTF-8');
        }, $errors);
        $allErrors = join('<br/>', $safeErrors);
        $errorMessage = "<p style='color: red;'>{$allErrors}</p>";
    }
}

?>
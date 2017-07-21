<?php
  if(empty($_POST['email'])     ||
    !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
    {
     echo "Form field(s) are empty";
     return false;
   } else {
     $contact_email = strip_tags(htmlspecialchars($_POST['email']));
     $to = "dan@bwarealty.com";
     $bcc = "pjliddy@gmail.com";
     $subject = "Contact from bwarealty.com";
     $message = "I'm interested in listing my house. Please contact me.\n\n" .
                "Email Address: " . $contact_email;
     $from = "contact@bwarealty.com";
     $headers = "From:" . $from . "\r\n" .
                "Reply-To: " . $contact_email . "\r\n" .
                "Bcc: $bcc";
     mail($to,$subject,$message,$headers);
     echo "Mail Sent.";
     return true;
   }
?>

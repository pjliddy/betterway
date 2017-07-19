<?php
  if(empty($_POST['email'])     ||
    !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
    {
     echo "Form field(s) are empty";
     return false;
    }

  $contact_email = strip_tags(htmlspecialchars($_POST['email']));
  $to = "pjliddy@gmail.com"; // <– replace with your address here
  $subject = "Contact from bwarealty.com";
  $message = "Yo, bitch! Sell my house for cheap!";
  $from = "contact@bwarealty.com";
  $headers = "From:" . $from;
  mail($to,$subject,$message,$headers);
  echo "Mail Sent.";
?>

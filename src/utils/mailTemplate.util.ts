export const transferMail = (
  userName: string,
  animalName: string,
  newOwner: string,
  link: string,
) => `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Transfer Request Received</title>
	<style>
		body {
			font-family: Arial, sans-serif;
			font-size: 16px;
			line-height: 1.5;
			margin: 0;
			padding: 0;
			background-color: #f1f1f1;
		}
		.container {
			max-width: 600px;
			margin: 0 auto;
			padding: 20px;
			background-color: #ffffff;
		}
		h1 {
			margin: 0 0 20px;
		}
		p {
			margin: 0 0 10px;
		}
		a {
			color: #0066cc;
			text-decoration: none;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>Transfer Request Received</h1>
		<p>Dear ${userName},</p>
		<p>We have received your transfer request for animal ${animalName} from ${newOwner} and it is currently being processed.</p>
		<p>Here is your transfer confirmation link: <a style="cursor:pointer" target="_blank" href=${link}>Confirm Transfer</a> or click <span style="color:#0F53AD;cursor:pointer">${link}</span></p>
		<p>Thank you for using our service.</p>
		<p>Best regards,</p>
		<p>Breeders Association</p>
	</div>
</body>
</html>

`;

export const sireOwnerVerificationEmail = (
  username: string,
  otp: number,
  reqUserName: string,
) => `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<title>One-Time Password Verification</title>
</head>
<body>
	<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
		<h2>One-Time Password Verification</h2>
		<p>Dear ${username},</p>
		<p>We have received a litter registration request from ${reqUserName}. Please provide the OTP to confirm the mating of your animal.
		<h1>${otp}</h1>

		<p>Thank you for using our service.</p>
		<p>If you have any questions or concerns, please feel free to contact our customer support team.</p>
		<p>Thank you,</p>
		<p>Breeders Association</p>
	</div>
</body>
</html>
`;

export const welcomeEmail = (userName: string, link: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Welcome to our service!</title>
  </head>
  <body style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333;">
    <p>Dear ${userName},</p>
    <p>Welcome to our service! We are thrilled to have you on board.</p>
    <p>To get started, please click the button below to verify your email address:</p>
    <p style="text-align: center;">
      <a href=${link} style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Verify my email address</a>
    </p>
    <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
    <p>Best regards,</p>
    <p>Breeders Association</p>
  </body>
</html>
`;

export const litterRegistrationRequest = (
  sireOwner: string,
  sireName: string,
  litterName: string,
  damOwner: string,
  link: string,
) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Litter Sire Confirmation Request Received</title>
	  <style>
		  body {
			  font-family: Arial, sans-serif;
			  font-size: 16px;
			  line-height: 1.5;
			  margin: 0;
			  padding: 0;
			  background-color: #f1f1f1;
		  }
		  .container {
			  max-width: 600px;
			  margin: 0 auto;
			  padding: 20px;
			  background-color: #ffffff;
		  }
		  h1 {
			  margin: 0 0 20px;
		  }
		  p {
			  margin: 0 0 10px;
		  }
		  a {
			  color: #0066cc;
			  text-decoration: none;
		  }
	  </style>
  </head>
  <body>
	  <div class="container">
		  <h1>Litter Sire Confirmation Request Received</h1>
		  <p>Dear ${sireOwner},</p>
		  <p>We have received sire confirmation request for animal ${sireName} from ${damOwner} for litter ${litterName} and it is currently being processed.</p>
		  <p>Here is your sire confirmation link for more details and further action: <a style="cursor:pointer" target="_blank" href=${link}>Confirm Sire</a> or click <span style="color:#0F53AD;cursor:pointer">${link}</span></p>
		  <p>Thank you for using our service.</p>
		  <p>Best regards,</p>
		  <p>Breeders Association</p>
	  </div>
  </body>
  </html>
  
  `;

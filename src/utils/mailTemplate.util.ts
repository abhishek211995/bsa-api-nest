export const emailContainer = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e9e9e9;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .logo {
            max-width: 200px;
        }

        .content {
            font-size: 16px;
            line-height: 1.5;
        }

        .footer {
            margin-top: 20px;
            text-align: center;
            color: #999999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="logo.png" alt="Logo" class="logo">
        </div>
        ${content}
		<p>Thank you for using our service.</p>
		<p>Best regards,</p>
		<p>Genuine Breeders Association</p>
        <div class="footer">
            This email was sent by Genuine Breeder Association. &copy; 2023 All rights reserved.
        </div>
    </div>
</body>
</html>
`;

export const transferMail = (
  userName: string,
  animalName: string,
  newOwner: string,
  link: string,
) => `
	<h1>Transfer Request Received</h1>
	<p>Dear ${userName},</p>
	<p>We have received your transfer request for animal ${animalName} from ${newOwner} and it is currently being processed.</p>
	<p>Here is your transfer confirmation link: <a style="cursor:pointer" target="_blank" href=${link}>Confirm Transfer</a> or click <span style="color:#0F53AD;cursor:pointer">${link}</span></p>
`;

export const sireOwnerVerificationEmail = (
  username: string,
  otp: number,
  reqUserName: string,
) => `
	<h1>One-Time Password Verification</h1>
	<p>Dear ${username},</p>
	<p>We have received a litter registration request from ${reqUserName}. Please provide the OTP to confirm the mating of your animal.
	<h1>${otp}</h1>
`;

export const welcomeEmail = (userName: string) => `
	<h1>Welcome to Genuine Breeder Association</h1>
    <p>Dear ${userName},</p>
    <p>Welcome to our service! We are thrilled to have you on board.</p>
    <p>Our support team will verify your details shortly.</p>
    <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
`;

export const litterRegistrationRequest = (
  sireOwner: string,
  animalName: string,
  damOwner: string,
  link: string,
) => `
	<h1>Litter Sire Confirmation Request Received</h1>
	<p>Dear ${sireOwner},</p>
	<p>We have received sire confirmation request for animal ${animalName} from ${damOwner} and it is currently being processed.</p>
	<p>Here is your sire confirmation link for more details and further action: <a style="cursor:pointer" target="_blank" href=${link}>Confirm Sire</a> or click <span style="color:#0F53AD;cursor:pointer">${link}</span></p>
  `;

export const userConfirmation = (userName: string, status: string) => `
			<h1> User Confirmation</h1>
			<p>Dear ${userName},</p>
			<p>We are ${
        status === "accepted" ? "glad" : "sorry"
      } to say that your profile is ${
  status === "accepted" ? "accepted" : "rejected"
} by the admin.</p>
			<p>For query please contact the admin.</p>
			<p>Thank you for using our service.</p>
			<p>Best regards,</p>
			<p>Breeders Association</p>
	
	`;

export const animalConfirmation = (
  userName: string,
  animal: string,
  status: string,
) => `
                  <h1> Animal Confirmation</h1>
                  <p>Dear ${userName},</p>
                  <p>We are ${
                    status === "accepted" ? "glad" : "sorry"
                  } to say that your animal ${animal} is ${
  status === "accepted" ? "accepted" : "rejected"
} by the admin.</p>
                  <p>For query please contact the admin.</p>
                  <p>Thank you for using our service.</p>
                  <p>Best regards,</p>
                  <p>Breeders Association</p>
          
          `;

export const litterConfirmation = (userName: string, status: string) => `
                      <h1> Litter Confirmation</h1>
                      <p>Dear ${userName},</p>
                      <p>We are ${
                        status === "accepted" ? "glad" : "sorry"
                      } to say that your litter is ${
  status === "accepted" ? "accepted" : "rejected"
} by the admin.</p>
                      <p>For query please contact the admin.</p>
                      <p>Thank you for using our service.</p>
                      <p>Best regards,</p>
                      <p>Breeders Association</p>
              
              `;

export const transferConfirmation = (
  newOwner: string,
  oldOwner: string,
  animal: string,
  status: string,
) =>
  `
              <h1> Transfer Request Confirmation</h1>
              <p>Dear ${newOwner},</p>
              <p>We are ${
                status === "accepted" ? "glad" : "sorry"
              } to say that your transfer request for animal ${animal} is ${
    status === "accepted" ? "accepted" : "rejected"
  } by the ${oldOwner}.</p>
              <p>For query please contact the admin / ${oldOwner}.</p>
              <p>Thank you for using our service.</p>
              <p>Best regards,</p>
              <p>Breeders Association</p>
      
      `;

// Reset Forgot password template
export const forgotPassword = (userName: string, link: string) =>
  `
  <h1>Password Reset Request Received</h1>
	<p>Dear ${userName},</p>
	<p>We have received forgot password request.</p>
	<p>Here is your reset password link for further action: <a style="cursor:pointer" target="_blank" href=${link}>Change Password</a> or click <span style="color:#0F53AD;cursor:pointer">${link}</span></p>
  `;

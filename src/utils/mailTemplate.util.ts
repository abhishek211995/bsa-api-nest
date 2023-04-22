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
</head>
<body>
	<table style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; border-collapse: collapse;">
		<!-- Header -->
		<tr>
			<td style="background-color: #f1f1f1; padding: 20px;">
				<h1 style="margin: 0;">Transfer Request Received</h1>
			</td>
		</tr>
		
		<!-- Body -->
		<tr>
			<td style="padding: 20px;">
				<p>Dear ${userName},</p>
				<p>We have received your transfer request for animal ${animalName} from ${newOwner} and it is currently being processed.</p>
				<p>Here is your transfer confirmation link: <a href=${link}>Confirm Transfer</a></p>
				<p>Thank you for using our service.</p>
				<p>Best regards,</p>
				<p>Breeders Association</p>
			</td>
		</tr>
		
		<!-- Footer -->
		<tr>
			<td style="background-color: #f1f1f1; padding: 20px; text-align: center;">
				<p style="margin: 0;">Breeders Association | Pune </p>
			</td>
		</tr>
	</table>
</body>
</html>

`;

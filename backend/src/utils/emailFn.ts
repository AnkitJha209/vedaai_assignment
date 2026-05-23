import nodemailer from "nodemailer";

type AssignmentEmailPayload = {
    to: string;
    userName?: string;
    assignmentTitle: string;
    pdfUrl: string;
};

const getTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        throw new Error("SMTP_HOST, SMTP_USER, and SMTP_PASS are required");
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
};

const buildAssignmentEmailHtml = (payload: AssignmentEmailPayload): string => {
    const greeting = payload.userName ? `Hi ${payload.userName},` : "Hi there,";
    return `
		<div style="font-family: Arial, sans-serif; color: #1a1a1a;">
			<h2 style="margin-bottom: 4px;">Your assignment is ready</h2>
			<p style="margin-top: 0;">${greeting}</p>
			<p>We have generated the assignment <strong>${payload.assignmentTitle}</strong>.</p>
			<p>You can download the paper using the button below:</p>
			<p style="margin: 20px 0;">
				<a href="${payload.pdfUrl}" style="background: #111827; color: #ffffff; padding: 12px 18px; text-decoration: none; border-radius: 6px; display: inline-block;">Download Assignment</a>
			</p>
			<p style="font-size: 12px; color: #6b7280;">If the button does not work, copy and paste this link in your browser:</p>
			<p style="font-size: 12px; color: #6b7280;">${payload.pdfUrl}</p>
		</div>
	`;
};

export const sendAssignmentReadyEmail = async (
    payload: AssignmentEmailPayload,
): Promise<void> => {
    const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
    if (!from) {
        throw new Error("SMTP_FROM is not set");
    }

    const transporter = getTransporter();
    const html = buildAssignmentEmailHtml(payload);
    const text = `Your assignment "${payload.assignmentTitle}" is ready. Download: ${payload.pdfUrl}`;

    await transporter.sendMail({
        from,
        to: payload.to,
        subject: "Your assignment is ready",
        text,
        html,
    });
};

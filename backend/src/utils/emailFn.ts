import nodemailer from "nodemailer";

type AssignmentEmailPayload = {
    to: string;
    userName?: string;
    assignmentTitle: string;
    pdfUrl: string;
    resultUrl: string;
    requestSummary?: string;
    scoreSummary?: string;
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
    const summary = payload.requestSummary
        ? `<p style="margin: 6px 0 0; color: #334155;">${payload.requestSummary}</p>`
        : "";
    const scoreLine = payload.scoreSummary
        ? `<p style="margin: 8px 0 0; color: #0f172a; font-weight: 600;">${payload.scoreSummary}</p>`
        : "";
    return `
        <div style="background: #ededed; padding: 24px;">
            <div style="max-width: 640px; margin: 0 auto; font-family: 'Trebuchet MS', 'Segoe UI', Arial, sans-serif; color: #111827; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 45px rgba(0,0,0,0.08);">
                <div style="background: #111111; color: #ffffff; padding: 22px 24px;">
                    <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7;">Veda AI</div>
                    <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 700;">Your assignment result is ready</h1>
                    <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">${greeting} We completed <strong>${payload.assignmentTitle}</strong>.</p>
                </div>
                <div style="padding: 22px 24px;">
                    <div style="border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; background: #f7f7f7;">
                        <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #374151;">
                            Open the result page to review the breakdown, then download the PDF anytime.
                        </p>
                        ${summary}
                        ${scoreLine}
                    </div>
                    <div style="margin: 18px 0 6px; display: flex; flex-wrap: wrap; gap: 10px;">
                        <a href="${payload.resultUrl}" style="background: #111111; color: #ffffff; padding: 12px 18px; text-decoration: none; border-radius: 999px; display: inline-block; font-weight: 600; border: 1px solid #f97316;">View Result</a>
                        <a href="${payload.pdfUrl}" style="background: #ffffff; color: #111111; padding: 12px 18px; text-decoration: none; border-radius: 999px; display: inline-block; font-weight: 600; border: 1px solid #e5e7eb;">Download PDF</a>
                    </div>
                    <div style="margin-top: 16px; padding: 14px 16px; background: #f3f3f3; border-radius: 14px; border: 1px solid #e5e7eb;">
                        <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 1.2px;">Quick Links</div>
                        <p style="margin: 8px 0 0; font-size: 13px; color: #374151; word-break: break-word;">Result page: ${payload.resultUrl}</p>
                        <p style="margin: 6px 0 0; font-size: 13px; color: #374151; word-break: break-word;">PDF link: ${payload.pdfUrl}</p>
                    </div>
                    <p style="margin: 18px 0 0; font-size: 12px; color: #6b7280;">
                        If you did not request this, you can ignore this email.
                    </p>
                </div>
            </div>
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
    const text = `Veda AI: Your assignment result is ready for "${payload.assignmentTitle}". Result: ${payload.resultUrl}. PDF: ${payload.pdfUrl}`;

    await transporter.sendMail({
        from,
        to: payload.to,
        subject: "Veda AI: Your assignment result is ready",
        text,
        html,
    });
};

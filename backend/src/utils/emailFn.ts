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
        <div style="background: #f8fafc; padding: 24px;">
            <div style="max-width: 640px; margin: 0 auto; font-family: 'Trebuchet MS', 'Segoe UI', Arial, sans-serif; color: #0f172a; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #0f172a, #2563eb); color: #ffffff; padding: 22px 24px;">
                    <div style="font-size: 12px; letter-spacing: 1.6px; text-transform: uppercase; opacity: 0.85;">Veda AI</div>
                    <h1 style="margin: 8px 0 0; font-size: 22px;">Your assignment result is ready</h1>
                    <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">${greeting} We have completed your request for <strong>${payload.assignmentTitle}</strong>.</p>
                </div>
                <div style="padding: 22px 24px;">
                    <p style="margin: 0; font-size: 15px; line-height: 1.5;">
                        Open the result page to review the full breakdown, then grab the PDF anytime.
                    </p>
                    ${summary}
                    ${scoreLine}
                    <div style="margin: 20px 0 10px; display: flex; flex-wrap: wrap; gap: 10px;">
                        <a href="${payload.resultUrl}" style="background: #0ea5e9; color: #ffffff; padding: 12px 18px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">View Result</a>
                        <a href="${payload.pdfUrl}" style="background: #0f172a; color: #ffffff; padding: 12px 18px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">Download PDF</a>
                    </div>
                    <div style="margin-top: 16px; padding: 14px 16px; background: #f1f5f9; border-radius: 10px;">
                        <div style="font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: 1.2px;">Quick Links</div>
                        <p style="margin: 8px 0 0; font-size: 13px; color: #334155; word-break: break-word;">Result page: ${payload.resultUrl}</p>
                        <p style="margin: 6px 0 0; font-size: 13px; color: #334155; word-break: break-word;">PDF link: ${payload.pdfUrl}</p>
                    </div>
                    <p style="margin: 18px 0 0; font-size: 12px; color: #64748b;">
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

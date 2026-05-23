import type { ResultPayload } from "../validation/resultSchema.js";

type PdfTemplateParams = {
    title: string;
    schoolName?: string;
    subjectName: string;
    gradeLevel: string;
    examDate: Date;
    totalMarks: number;
    sections: ResultPayload["sections"];
    answerKey?: ResultPayload["answerKey"];
};

const escapeHtml = (value: string): string => {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

export const buildExamHtml = (params: PdfTemplateParams): string => {
    const header = `
        <header class="header">
            <div class="school">${escapeHtml(params.schoolName ?? "School Name")}</div>
            <div class="title">${escapeHtml(params.title)}</div>
            <div class="meta">Subject: ${escapeHtml(params.subjectName)} | Class: ${escapeHtml(
                params.gradeLevel,
            )} | Exam Date: ${params.examDate.toDateString()} | Maximum Marks: ${params.totalMarks}</div>
        </header>
        <section class="student">
            <span>Name: __________________________</span>
            <span>Roll No: _____________</span>
        </section>
    `;

    const sectionsHtml = params.sections
        .map((section) => {
            const questionsHtml = section.questions
                .map((question) => {
                    const options = question.options?.length
                        ? `<ul class="options">${question.options
                              .map((option) => `<li>${escapeHtml(option)}</li>`)
                              .join("")}</ul>`
                        : "";
                    return `
                        <div class="question">
                            <div class="question-text">
                                <span class="number">${question.number}.</span>
                                <span>${escapeHtml(question.text)}</span>
                                <span class="marks">[${question.marks} marks]</span>
                            </div>
                            ${options}
                        </div>
                    `;
                })
                .join("");

            return `
                <section class="section">
                    <div class="section-title">${escapeHtml(section.title)}</div>
                    <div class="section-instruction">${escapeHtml(
                        section.instruction,
                    )}</div>
                    ${questionsHtml}
                </section>
            `;
        })
        .join("");

    const answerKey = params.answerKey?.length
        ? `
            <section class="answers">
                <div class="section-title">Answer Key</div>
                <ol>
                    ${params.answerKey
                        .map((answer) => {
                            const solution = answer.solution
                                ? ` - ${escapeHtml(answer.solution)}`
                                : "";
                            return `<li>${escapeHtml(
                                answer.answer,
                            )}${solution}</li>`;
                        })
                        .join("")}
                </ol>
            </section>
        `
        : "";

    return `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8" />
                <style>
                    body {
                        font-family: "Times New Roman", serif;
                        color: #111;
                        margin: 40px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 16px;
                    }
                    .school {
                        font-size: 18px;
                        font-weight: 700;
                    }
                    .title {
                        font-size: 16px;
                        margin-top: 4px;
                    }
                    .meta {
                        font-size: 12px;
                        margin-top: 6px;
                    }
                    .student {
                        display: flex;
                        justify-content: space-between;
                        font-size: 12px;
                        margin: 16px 0 20px;
                    }
                    .section {
                        margin-bottom: 18px;
                    }
                    .section-title {
                        font-size: 14px;
                        font-weight: 700;
                        margin-bottom: 4px;
                    }
                    .section-instruction {
                        font-size: 12px;
                        margin-bottom: 8px;
                    }
                    .question {
                        margin-bottom: 10px;
                        font-size: 12px;
                    }
                    .question-text {
                        display: flex;
                        gap: 6px;
                        align-items: baseline;
                    }
                    .number {
                        font-weight: 700;
                    }
                    .marks {
                        margin-left: auto;
                        font-size: 11px;
                    }
                    .options {
                        margin: 6px 0 0 18px;
                        padding: 0;
                    }
                    .options li {
                        list-style: disc;
                        margin-left: 16px;
                    }
                    .answers {
                        page-break-before: always;
                        font-size: 12px;
                    }
                    .answers ol {
                        padding-left: 18px;
                    }
                </style>
            </head>
            <body>
                ${header}
                ${sectionsHtml}
                ${answerKey}
            </body>
        </html>
    `;
};

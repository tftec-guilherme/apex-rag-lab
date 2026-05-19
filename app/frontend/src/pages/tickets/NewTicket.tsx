/**
 * Página `/tickets/new` — formulário de criação de ticket.
 *
 * Lab Avançado v0.4.0 (Bloco 5/6): habilitada como CRUD completo no Lab Av,
 * espelhando o backend tickets-service .NET (`POST /api/tickets`). Anteriormente
 * o botão "Novo ticket" da fila estava `disabled` ("Em breve") — agora rota
 * dedicada com validação client-side espelhando `RequestValidators.cs`:
 *
 * - subject: 5-200 chars (obrigatório)
 * - description: até 16k chars
 * - category: enum (Comercial/TI/Operacional/RH/Financeiro)
 * - priority: enum (Low/Medium/High/Critical)
 *
 * Padrões reusados da Tickets.tsx:
 * - Bearer token MSAL (`getToken`)
 * - i18n via react-i18next (chaves novas em pt-BR/en)
 * - Helmet pageTitle
 * - MessageBar para erros / sucesso
 */
import { useState, type FormEvent, type JSX } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useMsal } from "@azure/msal-react";
import {
    Button,
    Input,
    Textarea,
    Select,
    Field,
    MessageBar,
    MessageBarBody,
    MessageBarTitle,
    Spinner
} from "@fluentui/react-components";
import { ArrowLeft24Regular } from "@fluentui/react-icons";

import { createTicketApi, TICKET_CATEGORIES, TICKET_PRIORITIES } from "../../api";
import type { TicketCategory, TicketCreateBody, TicketPriority } from "../../api/ticketsModels";
import { useLogin, getToken } from "../../authConfig";

const SUBJECT_MIN = 5;
const SUBJECT_MAX = 200;
const DESCRIPTION_MAX = 16_000;

export function Component(): JSX.Element {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { instance } = useMsal();

    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<TicketCategory>("Operacional");
    const [priority, setPriority] = useState<TicketPriority>("Medium");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const subjectInvalid = subject.length > 0 && (subject.length < SUBJECT_MIN || subject.length > SUBJECT_MAX);
    const descriptionInvalid = description.length > DESCRIPTION_MAX;
    const canSubmit = subject.length >= SUBJECT_MIN && subject.length <= SUBJECT_MAX && !descriptionInvalid && !submitting;

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        if (!canSubmit) return;

        setSubmitting(true);
        setError(null);

        try {
            const idToken = useLogin && instance ? await getToken(instance) : undefined;
            const body: TicketCreateBody = {
                subject: subject.trim(),
                description: description.trim(),
                category,
                priority
            };
            const created = await createTicketApi(body, idToken);
            // Redireciona para o detalhe do ticket recém-criado
            navigate(`/tickets/${created.ticket_id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido ao criar ticket.");
            setSubmitting(false);
        }
    }

    return (
        <div style={{ padding: "var(--space-4, 24px)", maxWidth: 720, margin: "0 auto" }}>
            <Helmet>
                <title>{`${t("helpsphere.tickets.newTicket", { defaultValue: "Novo ticket" })} — ${t("helpsphere.appName")}`}</title>
            </Helmet>

            <header style={{ marginBottom: "var(--space-4, 24px)" }}>
                <Link
                    to="/tickets"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: "var(--color-text-secondary, #555)",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                        marginBottom: "var(--space-3, 16px)"
                    }}
                >
                    <ArrowLeft24Regular />
                    {t("helpsphere.tickets.backToList", { defaultValue: "Voltar para fila" })}
                </Link>
                <h2 style={{ margin: 0, fontFamily: "var(--font-display, serif)" }}>
                    {t("helpsphere.tickets.newTicket", { defaultValue: "Novo ticket" })}
                </h2>
                <p style={{ color: "var(--color-text-secondary, #666)", margin: "8px 0 0" }}>
                    {t("helpsphere.tickets.newTicketSubtitle", {
                        defaultValue: "Preencha o formulário para abrir um chamado no tenant atual."
                    })}
                </p>
            </header>

            {error && (
                <MessageBar intent="error" style={{ marginBottom: "var(--space-3, 16px)" }}>
                    <MessageBarBody>
                        <MessageBarTitle>
                            {t("helpsphere.tickets.errorTitle", { defaultValue: "Falha ao criar ticket" })}
                        </MessageBarTitle>
                        {error}
                    </MessageBarBody>
                </MessageBar>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Field
                    label={t("helpsphere.tickets.field.subject", { defaultValue: "Assunto" })}
                    required
                    validationState={subjectInvalid ? "error" : "none"}
                    validationMessage={
                        subjectInvalid
                            ? t("helpsphere.tickets.field.subjectInvalid", {
                                  defaultValue: `Assunto deve ter entre ${SUBJECT_MIN} e ${SUBJECT_MAX} caracteres.`
                              })
                            : undefined
                    }
                    hint={`${subject.length} / ${SUBJECT_MAX}`}
                >
                    <Input
                        value={subject}
                        onChange={(_, data) => setSubject(data.value)}
                        maxLength={SUBJECT_MAX}
                        placeholder={t("helpsphere.tickets.field.subjectPlaceholder", {
                            defaultValue: "Ex: Sistema PDV travando ao processar NFCe"
                        })}
                        autoFocus
                    />
                </Field>

                <Field
                    label={t("helpsphere.tickets.field.description", { defaultValue: "Descrição" })}
                    validationState={descriptionInvalid ? "error" : "none"}
                    validationMessage={
                        descriptionInvalid
                            ? t("helpsphere.tickets.field.descriptionInvalid", {
                                  defaultValue: `Descrição não pode exceder ${DESCRIPTION_MAX} caracteres.`
                              })
                            : undefined
                    }
                    hint={`${description.length} / ${DESCRIPTION_MAX}`}
                >
                    <Textarea
                        value={description}
                        onChange={(_, data) => setDescription(data.value)}
                        rows={6}
                        placeholder={t("helpsphere.tickets.field.descriptionPlaceholder", {
                            defaultValue: "Detalhe o problema, passos para reproduzir, mensagens de erro, urgência operacional…"
                        })}
                    />
                </Field>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Field label={t("helpsphere.tickets.field.category", { defaultValue: "Categoria" })} required>
                        <Select value={category} onChange={(_, data) => setCategory(data.value as TicketCategory)}>
                            {TICKET_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </Select>
                    </Field>

                    <Field label={t("helpsphere.tickets.field.priority", { defaultValue: "Prioridade" })} required>
                        <Select value={priority} onChange={(_, data) => setPriority(data.value as TicketPriority)}>
                            {TICKET_PRIORITIES.map(pri => (
                                <option key={pri} value={pri}>
                                    {pri}
                                </option>
                            ))}
                        </Select>
                    </Field>
                </div>

                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                    <Button appearance="secondary" type="button" onClick={() => navigate("/tickets")} disabled={submitting}>
                        {t("helpsphere.tickets.cancel", { defaultValue: "Cancelar" })}
                    </Button>
                    <Button appearance="primary" type="submit" disabled={!canSubmit}>
                        {submitting ? (
                            <Spinner size="tiny" label={t("helpsphere.tickets.submitting", { defaultValue: "Enviando…" })} />
                        ) : (
                            t("helpsphere.tickets.createSubmit", { defaultValue: "Criar ticket" })
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

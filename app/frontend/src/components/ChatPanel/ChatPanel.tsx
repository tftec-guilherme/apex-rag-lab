/**
 * ChatPanel — painel flutuante (canto inferior direito) que consome o endpoint
 * `/chat/rag` do backend Python.
 *
 * Story 06.10 — Lab Intermediário (Disciplina 06) Parte 8.
 *
 * Estado dormente (gating):
 *   1. Backend `RAG_ENABLED=true` (param Bicep `ragEnabled`) — expõe `/chat/rag`.
 *   2. Frontend monta o componente via `<Shell />` apenas quando:
 *      - `enableChat === true` (mesma flag da nav "Assistente IA")
 *      - URL contém `?chat=1` (Opção A do guia, Passo 8.4) OU `chat=1` no hash
 *      - `ragEnabled === true` no `/auth_setup`
 *
 * UX intencionalmente simples para suportar o checkpoint da Parte 8 sem
 * sobreengenhar (manutenção e leitura do código pelos alunos é primeira
 * prioridade). Itens fora de escopo: histórico de conversa, streaming,
 * markdown rendering, citation popovers. Tudo isso vive no `/chat` upstream
 * (página dedicada — o ChatPanel é um shortcut do Lab Inter).
 */
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useMsal } from "@azure/msal-react";

// [CRIAR-X 1]: importar o cliente HTTP do endpoint /chat/rag — sem este import o submit não consegue chamar o backend Python (Function App rota POST /chat/rag).
// Hint: import { ragSuggestApi, RagSuggestResponse } from "../../api/rag";
import { ragSuggestApi, RagSuggestResponse } from "../../api/rag";
import { getToken, useLogin } from "../../authConfig";

import styles from "./ChatPanel.module.css";

interface Props {
    /** Permite fechar o painel via "?chat=1" toggle no Shell. */
    onClose?: () => void;
}

interface RagResultState {
    response: RagSuggestResponse | null;
    error: string | null;
    loading: boolean;
}

const INITIAL_RESULT: RagResultState = { response: null, error: null, loading: false };

// [CRIAR-X 2]: declarar o componente como named export (consumido por Shell.tsx via `import { ChatPanel }`). Recebe prop `onClose` para fechar o painel via toggle ?chat=1 do Shell.
// Hint: export const ChatPanel = ({ onClose }: Props) => { ... };
export const ChatPanel = ({ onClose }: Props) => {
    const { instance } = useMsal();

    const [ticketId, setTicketId] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [result, setResult] = useState<RagResultState>(INITIAL_RESULT);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            if (abortRef.current) {
                abortRef.current.abort();
            }
        };
    }, []);

    const handleSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const ticketIdNum = Number(ticketId);
            // [CRIAR-X 3]: validar entrada antes de chamar API — ticket_id deve ser número positivo finito e descrição não pode ser vazia/whitespace. Falha aqui evita 400 do backend e dá feedback imediato (UX < 50ms vs ~2-3s de roundtrip RAG).
            // Hint: use Number.isFinite(ticketIdNum) && ticketIdNum > 0; depois description.trim() !== ""
            if (!Number.isFinite(ticketIdNum) || ticketIdNum <= 0) {
                setResult({ response: null, error: "Informe um ticket_id numérico válido (> 0).", loading: false });
                return;
            }
            const trimmedDescription = description.trim();
            if (!trimmedDescription) {
                setResult({ response: null, error: "Descreva a dúvida ou o ticket para o assistente.", loading: false });
                return;
            }

            if (abortRef.current) {
                abortRef.current.abort();
            }
            const controller = new AbortController();
            abortRef.current = controller;

            setResult({ response: null, error: null, loading: true });
            try {
                const idToken = useLogin ? await getToken(instance) : undefined;
                // [CRIAR-X 4]: chamar o endpoint /chat/rag passando ticket_id, descrição, idToken (JWT do MSAL via getToken) e signal de abort. A resposta RagSuggestResponse traz suggested_response + confidence + citations (saída end-to-end do pipeline RAG: AI Search → embeddings → GPT).
                // Hint: const response = await ragSuggestApi({ticketId, description}, idToken, controller.signal);
                const response = await ragSuggestApi(
                    {
                        ticketId: ticketIdNum,
                        description: trimmedDescription
                    },
                    idToken,
                    controller.signal
                );
                setResult({ response, error: null, loading: false });
            } catch (e) {
                if (controller.signal.aborted) {
                    return;
                }
                setResult({
                    response: null,
                    error: e instanceof Error ? e.message : String(e),
                    loading: false
                });
            }
        },
        [description, instance, ticketId]
    );

    if (collapsed) {
        return (
            <button
                type="button"
                className={styles.fab}
                aria-label="Abrir assistente RAG"
                onClick={() => setCollapsed(false)}
            >
                IA
            </button>
        );
    }

    return (
        <aside className={styles.panel} role="complementary" aria-label="Assistente RAG (Lab Intermediário)">
            <header className={styles.header}>
                <div className={styles.headerText}>
                    <span className={styles.kicker}>Lab Intermediário</span>
                    <h2 className={styles.title}>Assistente RAG</h2>
                </div>
                <div className={styles.headerActions}>
                    <button
                        type="button"
                        className={styles.iconButton}
                        aria-label="Minimizar painel"
                        onClick={() => setCollapsed(true)}
                    >
                        –
                    </button>
                    {onClose && (
                        <button
                            type="button"
                            className={styles.iconButton}
                            aria-label="Fechar painel"
                            onClick={onClose}
                        >
                            ×
                        </button>
                    )}
                </div>
            </header>

            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.label}>
                    <span>Ticket #</span>
                    <input
                        type="number"
                        min={1}
                        inputMode="numeric"
                        className={styles.input}
                        placeholder="4521"
                        value={ticketId}
                        onChange={e => setTicketId(e.target.value)}
                        disabled={result.loading}
                        required
                    />
                </label>
                <label className={styles.label}>
                    <span>Descrição / dúvida</span>
                    <textarea
                        className={styles.textarea}
                        placeholder="Como reembolsar lojista quando pedido não foi entregue?"
                        rows={3}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        disabled={result.loading}
                        required
                    />
                </label>
                <button type="submit" className={styles.submit} disabled={result.loading}>
                    {/* [CRIAR-X 5]: label do botão muda durante loading — UX fundamental para aluno entender que requisição está em flight (~2-3s do roundtrip RAG). Sem feedback visual aluno clica de novo e gera duplicate request. */}
                    {/* Hint: {result.loading ? "Consultando RAG…" : "Sugerir resposta"} */}
                    {result.loading ? "Consultando RAG…" : "Sugerir resposta"}
                </button>
            </form>

            {result.error && (
                <div className={styles.errorBox} role="alert">
                    {result.error}
                </div>
            )}
            {result.response && (
                <div className={styles.resultBox}>
                    {/* [CRIAR-X 6]: exibir suggested_response (texto gerado pelo GPT) + confidence convertido para percentual. Esta é a saída visível do RAG end-to-end — o que aluno demonstra funcionando no checkpoint da Parte 8. */}
                    {/* Hint: <p>{result.response.suggested_response}</p> e {(result.response.confidence * 100).toFixed(0)}% */}
                    <p className={styles.resultText}>{result.response.suggested_response}</p>
                    {typeof result.response.confidence === "number" && (
                        <p className={styles.confidence}>
                            Confiança: <strong>{(result.response.confidence * 100).toFixed(0)}%</strong>
                        </p>
                    )}
                    {/* [CRIAR-X 7]: exibir as citations (source PDF + página opcional) — fundamentais para confiabilidade do RAG (aluno vê de onde a resposta veio, evitando hallucination). Sem citations visíveis o RAG vira "magic chatbot" e perde valor pedagógico. */}
                    {/* Hint: result.response.citations.map((c, idx) => <li>{c.source} · pág. {c.page}</li>) */}
                    {result.response.citations && result.response.citations.length > 0 && (
                        <ul className={styles.citations} aria-label="Citações">
                            {result.response.citations.map((c, idx) => (
                                <li key={`${c.source}-${idx}`}>
                                    <span className={styles.citationSource}>{c.source}</span>
                                    {typeof c.page === "number" && (
                                        <span className={styles.citationPage}> · pág. {c.page}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </aside>
    );
};

export default ChatPanel;

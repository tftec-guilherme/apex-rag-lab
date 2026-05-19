/**
 * Página `/tickets` — lista paginada de tickets do tenant logado.
 *
 * Redesign "Apex Executivo" (Wave 3.H, v2.1.0):
 * - Layout vertical com header destacado (font-display) + filtros sticky + lista refinada
 * - Filtros: pills toggle de status (acessíveis), dropdowns nativos para prioridade/categoria,
 *   search livre — todos espelhados em URL (`useSearchParams`) para deep-linking
 * - Linhas de ticket via componente `TicketRow` (grid 7 colunas, hover sutil, link nativo)
 * - Estado vazio via componente `EmptyState` com ilustração SVG inline e CTA "Limpar filtros"
 * - Paginação numérica simples (← Página X de Y →)
 * - Tokens do design system (`var(--color-*)`, `var(--space-*)`, `var(--font-*)`)
 *
 * Mantém das versões anteriores:
 * - Bearer token MSAL, i18n via react-i18next, Helmet pageTitle, Skeleton de loading,
 *   busca client-side sobre subject (filtros server-side já reduziram dataset)
 */
import { useEffect, useMemo, useState, type JSX } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useMsal } from "@azure/msal-react";
import { Button, MessageBar, MessageBarBody, MessageBarTitle, Skeleton, SkeletonItem } from "@fluentui/react-components";
import { ArrowClockwise24Regular, Add24Regular } from "@fluentui/react-icons";

import styles from "./Tickets.module.css";
import { listTicketsApi, type TicketsListResponse } from "../../api";
import { TICKET_CATEGORIES, type TicketCategory, type TicketPriority, type TicketStatus } from "../../api/ticketsModels";
import { TicketRow } from "../../components/TicketRow/TicketRow";
import { TicketFilters, type TicketFiltersValue } from "../../components/Filters/TicketFilters";
import { EmptyState, InboxIcon } from "../../components/EmptyState/EmptyState";
import { useLogin, getToken } from "../../authConfig";

const PAGE_SIZE = 20;

export function Component(): JSX.Element {
    const { t, i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { instance } = useMsal();

    const statusParam = (searchParams.get("status") as TicketStatus | null) ?? undefined;
    const priorityParam = (searchParams.get("priority") as TicketPriority | null) ?? undefined;
    const categoryParam = (searchParams.get("category") as TicketCategory | null) ?? undefined;
    const queryParam = searchParams.get("q") ?? "";
    const pageParam = Math.max(1, Number(searchParams.get("page")) || 1);

    const [data, setData] = useState<TicketsListResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const idToken = useLogin && instance ? await getToken(instance) : undefined;
                const response = await listTicketsApi(
                    {
                        status: statusParam,
                        category: categoryParam,
                        // Lab Avançado v0.4.0: priority + q agora server-side
                        // (paginação consistente — antes filter client-side podia esvaziar páginas).
                        priority: priorityParam,
                        q: queryParam.trim() || undefined,
                        limit: PAGE_SIZE,
                        offset: (pageParam - 1) * PAGE_SIZE
                    },
                    idToken
                );
                if (!cancelled) setData(response);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : String(e));
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        void load();
        return () => {
            cancelled = true;
        };
    }, [statusParam, categoryParam, priorityParam, queryParam, pageParam, instance, reloadKey]);

    /**
     * Lab Avançado v0.4.0: filter client-side removido — agora backend filtra por
     * priority + q (busca em subject). `visibleItems` apenas reflete a resposta
     * server-side, preservando a totalização da paginação.
     */
    const visibleItems = useMemo(() => data?.items ?? [], [data]);

    const total = data?.pagination?.total ?? 0;
    const totalPages = total === 0 ? 1 : Math.ceil(total / PAGE_SIZE);

    const handleFiltersChange = (next: TicketFiltersValue) => {
        const nextParams = new URLSearchParams(searchParams);
        const apply = (key: string, value: string | undefined) => {
            if (value === undefined || value === "") nextParams.delete(key);
            else nextParams.set(key, value);
        };
        apply("status", next.status);
        apply("priority", next.priority);
        apply("category", next.category);
        apply("q", next.search);
        nextParams.delete("page"); // reset paginação ao mudar filtros
        setSearchParams(nextParams, { replace: true });
    };

    const clearFilters = () => {
        setSearchParams(new URLSearchParams(), { replace: true });
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        const next = new URLSearchParams(searchParams);
        if (page === 1) next.delete("page");
        else next.set("page", String(page));
        setSearchParams(next, { replace: true });
    };

    const hasFilters = Boolean(statusParam || priorityParam || categoryParam || queryParam);
    const localeTag = i18n.resolvedLanguage === "ptBR" ? "pt-BR" : i18n.resolvedLanguage || "en";
    const ticketCountLabel = `${total} ${total === 1 ? "ticket" : "tickets"}`;

    return (
        <div className={styles.page}>
            <Helmet>
                <title>{`${t("helpsphere.tickets.pageTitle")} — ${t("helpsphere.appName")}`}</title>
            </Helmet>

            <header className={styles.header}>
                <div>
                    <h2 className={styles.title}>{t("helpsphere.tickets.pageTitle")}</h2>
                    <p className={styles.subtitle}>{ticketCountLabel}</p>
                </div>
                <div className={styles.actions}>
                    {/* Lab Avançado v0.4.0: botão habilitado, rota /tickets/new com form completo. */}
                    <Button
                        as="a"
                        href="#/tickets/new"
                        appearance="primary"
                        icon={<Add24Regular />}
                    >
                        {t("helpsphere.tickets.newTicket", { defaultValue: "Novo ticket" })}
                    </Button>
                </div>
            </header>

            <TicketFilters
                status={statusParam}
                priority={priorityParam}
                category={categoryParam}
                search={queryParam}
                categoryOptions={TICKET_CATEGORIES}
                onChange={handleFiltersChange}
            />

            {error && (
                <MessageBar intent="error" className={styles.errorBar}>
                    <MessageBarBody>
                        <MessageBarTitle>{t("helpsphere.tickets.errorLoading")}</MessageBarTitle>
                        {error}
                    </MessageBarBody>
                    <Button appearance="subtle" icon={<ArrowClockwise24Regular />} onClick={() => setReloadKey(k => k + 1)}>
                        {t("helpsphere.tickets.retry")}
                    </Button>
                </MessageBar>
            )}

            {loading && !data && <TicketsSkeleton />}

            {!loading && !error && visibleItems.length === 0 && (
                <EmptyState
                    icon={<InboxIcon />}
                    title={t("helpsphere.tickets.empty")}
                    description={hasFilters ? "Tente ajustar ou limpar os filtros aplicados." : undefined}
                    action={
                        hasFilters ? (
                            <Button appearance="primary" onClick={clearFilters}>
                                {t("helpsphere.tickets.filters.clear")}
                            </Button>
                        ) : undefined
                    }
                />
            )}

            {!error && data && visibleItems.length > 0 && (
                <div className={styles.list}>
                    {visibleItems.map(ticket => (
                        <TicketRow key={ticket.ticket_id} ticket={ticket} locale={localeTag} />
                    ))}
                </div>
            )}

            {!error && data && totalPages > 1 && (
                <nav className={styles.pagination} aria-label="Paginação">
                    <button
                        type="button"
                        className={styles.pageBtn}
                        disabled={pageParam <= 1}
                        onClick={() => goToPage(pageParam - 1)}
                        aria-label={t("helpsphere.tickets.pagination.previous")}
                    >
                        ‹
                    </button>
                    <span className={styles.pageIndicator}>{t("helpsphere.tickets.pagination.page", { page: pageParam, total: totalPages })}</span>
                    <button
                        type="button"
                        className={styles.pageBtn}
                        disabled={pageParam >= totalPages}
                        onClick={() => goToPage(pageParam + 1)}
                        aria-label={t("helpsphere.tickets.pagination.next")}
                    >
                        ›
                    </button>
                </nav>
            )}
        </div>
    );
}

Component.displayName = "Tickets";

function TicketsSkeleton() {
    return (
        <div className={styles.list} aria-busy="true" aria-live="polite">
            <Skeleton>
                {Array.from({ length: 6 }).map((_, idx) => (
                    <div className={styles.skeletonRow} key={idx}>
                        <SkeletonItem shape="circle" size={12} />
                        <SkeletonItem shape="rectangle" size={16} style={{ width: "3.5rem" }} />
                        <SkeletonItem shape="rectangle" size={16} style={{ flex: 1 }} />
                        <SkeletonItem shape="rectangle" size={16} style={{ width: "5rem" }} />
                        <SkeletonItem shape="rectangle" size={16} style={{ width: "4rem" }} />
                    </div>
                ))}
            </Skeleton>
        </div>
    );
}

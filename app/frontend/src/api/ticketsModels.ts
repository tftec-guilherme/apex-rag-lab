/**
 * Tipos do domínio HelpSphere espelhando o contract dos endpoints
 * `app/backend/blueprints/tickets.py`. snake_case preservado para
 * casar 1:1 com o JSON do backend (sem mapeamento extra no client).
 */

export const TICKET_STATUSES = ["Open", "InProgress", "Resolved", "Escalated"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const TICKET_CATEGORIES = ["Comercial", "TI", "Operacional", "RH", "Financeiro"] as const;
export type TicketCategory = (typeof TICKET_CATEGORIES)[number];

export interface Ticket {
    ticket_id: number;
    tenant_id: string;
    subject: string;
    description: string;
    category: TicketCategory;
    language: string;
    status: TicketStatus;
    priority: TicketPriority;
    confidence_score: number | null;
    /** JSON array string de paths blob — caller faz parse com try/catch */
    attachment_blob_paths: string | null;
    created_at: string;
    updated_at: string;
}

export interface TicketComment {
    comment_id: number;
    ticket_id?: number;
    author: string;
    content: string;
    created_at: string;
}

export interface TicketDetail extends Ticket {
    comments: TicketComment[];
}

export interface TicketsPagination {
    limit: number;
    offset: number;
    total: number;
}

export interface TicketsListResponse {
    items: Ticket[];
    pagination: TicketsPagination;
}

export interface Tenant {
    tenant_id: string;
    brand_name: string;
    created_at: string;
}

export interface TicketsListFilters {
    status?: TicketStatus;
    category?: TicketCategory;
    /** Lab Avançado v0.4.0: filtro de prioridade agora server-side. */
    priority?: TicketPriority;
    /** Lab Avançado v0.4.0: busca textual (LIKE em subject) já enviada ao backend. */
    q?: string;
    limit?: number;
    offset?: number;
}

/**
 * Body do PUT /api/tickets/{id} — campos opcionais que o backend .NET aceita.
 * Lab Avançado v0.4.0: estendido para subject/description/priority/attachments (UPDATE
 * form completo). Para transições de status, usar `transitionTicketStatusApi`. Category
 * é IMMUTABLE após criação (preserva taxonomia — DECISION-LOG.md).
 */
export interface TicketPatchBody {
    subject?: string;
    description?: string;
    priority?: TicketPriority;
    attachment_blob_paths?: string | null;
}

/**
 * Lab Avançado v0.4.0: body do POST /api/tickets/{id}/transitions
 * (state machine validada no backend — Open ↔ InProgress ↔ Resolved + Escalated).
 */
export interface TicketTransitionBody {
    next_status: TicketStatus;
    /** Comentário opcional (vira auto-comment na thread). */
    note?: string;
}

/**
 * Lab Avançado v0.4.0: body do POST /api/tickets (criação de ticket).
 * Backend gera ticket_id (IDENTITY), tenant_id (do JWT), status="Open" e timestamps.
 */
export interface TicketCreateBody {
    subject: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    language?: string;
    confidence_score?: number | null;
    attachment_blob_paths?: string | null;
}

/**
 * Lab Avançado v0.4.0: body do POST /api/tickets/{id}/comments
 * (anteriormente apenas stub no rag-lab — agora endpoint real implementado).
 */
export interface CommentCreateBody {
    content: string;
}

export interface SuggestStubResponse {
    detail: string;
    ticket_id: number;
    implementation_status: string;
    see_also: string;
}

export interface ApiErrorBody {
    error?: string;
    detail?: string;
    description?: string;
    details?: unknown;
}

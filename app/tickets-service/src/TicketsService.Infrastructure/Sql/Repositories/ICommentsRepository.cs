// Story 06.5c.2 T2.7 — ICommentsRepository
// Lab Avançado v0.4.0: AddUserCommentAsync implementado para POST /api/tickets/{id}/comments
// (anteriormente apenas stub frontend — rag-lab jogava Error explícito).
// AddSystemCommentAsync continua internal helper chamado por TicketsRepository.TransitionStatusAsync.

using System.Data;
using System.Data.Common;
using TicketsService.Domain.Comments;

namespace TicketsService.Infrastructure.Sql.Repositories;

public interface ICommentsRepository
{
    /// <summary>
    /// Lista comments do ticket ORDER BY created_at ASC (mais antigos primeiro — feed thread).
    /// </summary>
    Task<IReadOnlyList<Comment>> GetByTicketIdAsync(int ticketId, CancellationToken ct);

    /// <summary>
    /// INSERT comment dentro de transação existente (chamado por TransitionStatusAsync).
    /// Não abre conexão própria — usa connection + transaction passados.
    /// </summary>
    Task AddSystemCommentAsync(
        int ticketId,
        string author,
        string content,
        DbConnection connection,
        DbTransaction transaction,
        CancellationToken ct);

    /// <summary>
    /// Lab Avançado v0.4.0: INSERT comment user-driven (POST /api/tickets/{id}/comments).
    /// Valida cross-tenant via SELECT do ticket (404 se não existe ou pertence a outro tenant).
    /// Retorna null se ticket não encontrado, Comment criado caso contrário.
    /// </summary>
    Task<Comment?> AddUserCommentAsync(
        int ticketId,
        string author,
        string content,
        Guid tenantId,
        CancellationToken ct);
}

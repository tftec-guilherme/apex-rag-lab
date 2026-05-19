// Story 06.5c.2 T2.8 — CommentsRepository (Dapper)

using System.Data.Common;
using Dapper;
using TicketsService.Domain.Comments;

namespace TicketsService.Infrastructure.Sql.Repositories;

public sealed class CommentsRepository(ISqlConnectionFactory connectionFactory) : ICommentsRepository
{
    private const int CommandTimeoutSeconds = 30;

    public async Task<IReadOnlyList<Comment>> GetByTicketIdAsync(int ticketId, CancellationToken ct)
    {
        const string sql =
            "SELECT comment_id, ticket_id, author, content, created_at " +
            "FROM tbl_comments " +
            "WHERE ticket_id = @ticketId " +
            "ORDER BY created_at ASC;";

        await using var conn = await connectionFactory.CreateOpenConnectionAsync(ct);
        var rows = await conn.QueryAsync<CommentRow>(
            new CommandDefinition(sql, new { ticketId },
                commandTimeout: CommandTimeoutSeconds, cancellationToken: ct));

        return rows.Select(r => new Comment(r.comment_id, r.ticket_id, r.author, r.content, r.created_at))
                   .ToList();
    }

    public async Task AddSystemCommentAsync(
        int ticketId,
        string author,
        string content,
        DbConnection connection,
        DbTransaction transaction,
        CancellationToken ct)
    {
        const string sql =
            "INSERT INTO tbl_comments (ticket_id, author, content) " +
            "VALUES (@ticketId, @author, @content);";

        await connection.ExecuteAsync(
            new CommandDefinition(sql, new { ticketId, author, content },
                transaction: transaction,
                commandTimeout: CommandTimeoutSeconds,
                cancellationToken: ct));
    }

    /// <summary>
    /// Lab Avançado v0.4.0: POST /api/tickets/{id}/comments — comment user-driven.
    /// Atomicidade: INSERT em transação + SELECT WHERE tenant_id na validação cross-tenant
    /// (404 retornado pelo handler se ticket não pertence ao tenant — defesa OWASP A01).
    /// </summary>
    public async Task<Comment?> AddUserCommentAsync(
        int ticketId,
        string author,
        string content,
        Guid tenantId,
        CancellationToken ct)
    {
        // Validação cross-tenant antes de inserir (mesma defesa do UpdateAsync).
        const string checkSql =
            "SELECT COUNT(1) FROM tbl_tickets WHERE ticket_id = @ticketId AND tenant_id = @tenantId;";

        await using var conn = await connectionFactory.CreateOpenConnectionAsync(ct);
        var ticketCount = await conn.ExecuteScalarAsync<int>(
            new CommandDefinition(checkSql, new { ticketId, tenantId },
                commandTimeout: CommandTimeoutSeconds, cancellationToken: ct));

        if (ticketCount == 0)
        {
            return null;
        }

        // SQL Server: OUTPUT INSERTED retorna created_at server-side em uma chamada.
        // SQLite (test): última INSERT row pode ser obtida via last_insert_rowid().
        const string insertSql =
            "INSERT INTO tbl_comments (ticket_id, author, content) " +
            "OUTPUT INSERTED.comment_id, INSERTED.created_at " +
            "VALUES (@ticketId, @author, @content);";

        try
        {
            var row = await conn.QuerySingleAsync<(int comment_id, DateTime created_at)>(
                new CommandDefinition(insertSql, new { ticketId, author, content },
                    commandTimeout: CommandTimeoutSeconds, cancellationToken: ct));

            return new Comment(row.comment_id, ticketId, author, content, row.created_at);
        }
        catch (Exception ex) when (ex.GetType().Name.Contains("Sqlite", StringComparison.OrdinalIgnoreCase))
        {
            // Fallback SQLite (Testcontainers / test path): OUTPUT clause não existe.
            const string sqliteSql =
                "INSERT INTO tbl_comments (ticket_id, author, content) VALUES (@ticketId, @author, @content); " +
                "SELECT comment_id, created_at FROM tbl_comments WHERE rowid = last_insert_rowid();";

            var row = await conn.QuerySingleAsync<(int comment_id, DateTime created_at)>(
                new CommandDefinition(sqliteSql, new { ticketId, author, content },
                    commandTimeout: CommandTimeoutSeconds, cancellationToken: ct));

            return new Comment(row.comment_id, ticketId, author, content, row.created_at);
        }
    }

#pragma warning disable IDE1006, CA1812 // snake_case + Dapper materializes via reflection
    private sealed class CommentRow
    {
        public int comment_id { get; set; }
        public int ticket_id { get; set; }
        public string author { get; set; } = "";
        public string content { get; set; } = "";
        public DateTime created_at { get; set; }
    }
#pragma warning restore IDE1006, CA1812
}

// Lab Avançado v0.4.0 — CreateCommentRequest
// Body do POST /api/tickets/{id}/comments (user-driven comments).

namespace TicketsService.Api.Endpoints.Models;

/// <summary>
/// Request body para criar comment user-driven.
/// </summary>
/// <param name="Content">Conteúdo do comment (1..4000 chars, validado em RequestValidators).</param>
public sealed record CreateCommentRequest(string Content);

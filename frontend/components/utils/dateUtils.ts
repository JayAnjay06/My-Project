export const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return "Tanggal tidak valid";
  }
};

export const getTimeAgo = (dateString: string): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffHours < 168) return `${Math.floor(diffHours/24)} hari lalu`;
    return formatDate(dateString);
  } catch {
    return "Waktu tidak valid";
  }
};
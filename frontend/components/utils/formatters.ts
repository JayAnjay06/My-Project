export const formatNumber = (num: number): string => {
  if (!num) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return "-";
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "Tidak ada deskripsi";
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};
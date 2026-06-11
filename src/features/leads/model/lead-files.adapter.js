function getFileNameFromPath(value) {
   if (!value) return '';

   const cleanValue = String(value).split('?')[0].split('#')[0];
   const parts = cleanValue.split('/');

   return decodeURIComponent(parts[parts.length - 1] || '');
}

function mapLeadFileFromApi(apiFile, index) {
   const fileNameFromUrl = getFileNameFromPath(apiFile.url);
   const fileNameFromPath = getFileNameFromPath(apiFile.path);

   const fileName =
      apiFile.file_name ||
      apiFile.fileName ||
      apiFile.original_name ||
      apiFile.originalName ||
      apiFile.filename ||
      apiFile.original_filename ||
      fileNameFromUrl ||
      fileNameFromPath ||
      `file-${index + 1}`;

   return {
      id: apiFile.path || apiFile.url || apiFile.id || `file-${index}`,
      name: apiFile.name || apiFile.title || 'Документ',
      context: apiFile.context || '',
      fileName,
      fileUrl: apiFile.url || apiFile.path || '#',
      fileType: apiFile.type || apiFile.mime_type || '',
      createdAt: apiFile.created_at || null,
      path: apiFile.path || '',
      source: apiFile.source || 'forwarder',
      raw: apiFile,
   };
}

export function mapLeadFilesResponseFromApi(response) {
   const data = response?.data ?? response;

   const files = Array.isArray(data)
      ? data
      : data?.files || data?.data?.files || [];

   return Array.isArray(files) ? files.map(mapLeadFileFromApi) : [];
}

export interface DownloadFile {
    name: string;
    content: string;
}

export const download = ({ name, content }: DownloadFile) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = name;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
};

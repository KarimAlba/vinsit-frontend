import axiosIns from '@/libs/axios';
import useJwt from '@/auth/jwt/useJwt';

const downloadPdf = async(url, fileName) => {
    const downloadLinkElem = document.createElement('a');
    downloadLinkElem.setAttribute('download', fileName);
    downloadLinkElem.id = 'download-pdf-link';
    downloadLinkElem.style.display = 'none';
    const res = await axiosIns.get(url, {
        headers: {
            'Authorization': `Bearer ${useJwt.getToken()}`,
        },
        responseType: 'blob'
    });
    downloadLinkElem.href = window.URL.createObjectURL(res.data);
    // console.log(downloadLinkElem);
    document.documentElement.append(downloadLinkElem);
    const elem = document.documentElement.querySelector('#download-pdf-link');
    elem.click();
    window.URL.revokeObjectURL(downloadLinkElem.href);
    elem.remove();
};

export default downloadPdf;

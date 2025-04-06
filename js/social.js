const socialShare = {
    facebook(url) {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    },
    
    twitter(url, text) {
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    },
    
    whatsapp(text) {
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
};
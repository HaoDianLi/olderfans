
const helpers = {
    
    countChars(string) {

        let count = 0;
        for (let c in string) count++;
        return count;

    },

    convertLowercase(string) { return string.toLowerCase(); },

    onlyLetters(string) {

        const pattern = /^[a-zA-Z]+$/;
        if (pattern.test(string)) return true;
        else return false;

    },

    allowedChars(string) {

        const pattern = /^[a-zA-Z0-9_\-\.]+$/;
        if (pattern.test(string)) return true;
        else return false;

    },

    tokenizeEmailAt(email) {

        const parts = email.split('@');

        if (parts.length !== 2) return null;

        const localPart = parts[0];
        const domainPart = parts[1];

        return { localPart, domainPart };

    },

    domainRestrictions(domain) {

        const validTLDs = [
            "com",
            "org",
            "net",
            "gov",
            "edu",
            "mil",
        ];

        const parts = domain.split('.');
        const len = parts.length;

        // checks for at least one period
        if (len === 1) return null;

        // check for valid tld
        const tld = parts[len - 1].toLowerCase();
        if (!validTLDs.includes(tld)) return null;

        // cannot start with period
        if (parts[0] === '.') return null;

        for (let i = 0; i < len; i++) {
            // check for consecutive periods
            if (parts[i].length === 0) return null;
            // check for special chars
            if (!helpers.onlyLetters(parts[i])) return null;
        }

        return tld;

    }

};

export default helpers;
export type Lang = "en" | "hi";

export const t = (lang: Lang) => ({
  uploadReport: lang === "hi" ? "रिपोर्ट अपलोड करें" : "Upload Report",
  analyze:      lang === "hi" ? "रिपोर्ट विश्लेषण"   : "Analyze Report",
  summary:      lang === "hi" ? "सारांश"           : "Summary",
  details:      lang === "hi" ? "विस्तृत विश्लेषण"  : "Detailed Analysis",
  disclaimer:   lang === "hi"
    ? "यह AI-जनित विश्लेषण केवल सूचना के लिए है। चिकित्सा सलाह हेतु कृपया चिकित्सक से परामर्श करें।"
    : "This is an AI-generated analysis and is for informational purposes only. Please consult a qualified doctor.",
});

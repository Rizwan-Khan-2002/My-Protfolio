// Fallback content used by the About page + home sections until the admin
// edits the Profile from the dashboard. Pre-filled from Rizwan's resume.
export const profileDefaults = {
    name: 'MD Rizwan Khan',
    title: 'MBA (Finance & IT) · MERN Stack Developer',
    tagline: 'Combining business knowledge with full-stack engineering.',
    bio:
        'MBA (Finance & Information Technology) graduate with a strong academic foundation in ' +
        'Commerce, Finance, Business Management and Information Technology. Skilled in Financial ' +
        'Analysis, ERP, SAP Fundamentals, Computer Applications and Full-Stack Web Development. ' +
        'Experienced in building real-world projects including ERP systems and web applications ' +
        'using the MERN stack. I love combining business insight with technical expertise to solve ' +
        'organizational challenges and support business growth.',
    photoUrl: '/profile.jpg',
    location: 'Varanasi, Uttar Pradesh, India',
    email: 'rizwan.creativeswork@gmail.com',
    phone: '+91 8009030734',
    available: true,
    socials: {
        github: 'https://github.com/Rizwan-Khan-2002',
        linkedin: 'https://www.linkedin.com/in/rizwankhan8756',
        twitter: '',
        whatsapp: 'https://wa.me/918009030734',
        website: 'https://rizwankhan-portfolio.vercel.app',
    },
    stats: {
        experienceYears: '1+',
        projectsCompleted: '10+',
        happyClients: '5+',
    },
    education: [
        {
            degree: 'Master of Business Administration (MBA) — Finance & IT',
            institution: 'J.S. University, Shikohabad, Uttar Pradesh',
            period: '2024',
            description: 'Specialization in Finance & Information Technology.',
        },
        {
            degree: 'Bachelor of Commerce (B.Com)',
            institution: 'Prof. Rajendra Singh (Rajju Bhaiya) University (Allahabad State University), Prayagraj',
            period: '2022',
            description: 'Foundation in Commerce, Accounting and Business Management.',
        },
        {
            degree: 'Intermediate (12th — Commerce)',
            institution: 'K.P. College, Prayagraj — U.P. Board',
            period: '2018',
            description: '',
        },
        {
            degree: 'High School (10th)',
            institution: 'Iqra Model School, Bara Ghazipur — CBSE Board',
            period: '2016',
            description: '',
        },
    ],
    experience: [
        {
            role: 'MERN Stack Web Developer',
            company: 'Freelance / Personal Projects',
            period: '2023 — Present',
            description:
                'Building full-stack web applications and ERP systems with React, Node.js, Express ' +
                'and MongoDB — including a School Management ERP, NoteVault and this portfolio.',
        },
        {
            role: 'Business & Finance (MBA)',
            company: 'Academic & Project Work',
            period: '2022 — 2024',
            description:
                'Applied Financial Analysis, Business Analytics, ERP concepts and SAP fundamentals ' +
                'to real-world business problems.',
        },
    ],
    skills: [
        { name: 'React.js', level: 90 },
        { name: 'JavaScript (ES6+)', level: 90 },
        { name: 'Node.js', level: 85 },
        { name: 'Express.js', level: 85 },
        { name: 'MongoDB', level: 80 },
        { name: 'HTML5 & CSS3', level: 90 },
        { name: 'REST API Development', level: 85 },
        { name: 'Git & GitHub', level: 85 },
        { name: 'Financial Analysis & ERP', level: 80 },
        { name: 'Java (Basic)', level: 60 },
    ],
};

// Merge a (possibly partial / null) API profile over the defaults so the UI
// always has every field. Empty arrays from the API fall back to defaults.
export const mergeProfile = (apiProfile) => {
    if (!apiProfile) return profileDefaults;
    const p = { ...profileDefaults, ...apiProfile };
    p.socials = { ...profileDefaults.socials, ...(apiProfile.socials || {}) };
    p.stats = { ...profileDefaults.stats, ...(apiProfile.stats || {}) };
    p.education = apiProfile.education?.length ? apiProfile.education : profileDefaults.education;
    p.experience = apiProfile.experience?.length ? apiProfile.experience : profileDefaults.experience;
    p.skills = apiProfile.skills?.length ? apiProfile.skills : profileDefaults.skills;
    // If the admin hasn't uploaded a photo, keep the bundled default photo.
    if (!apiProfile.photoUrl) p.photoUrl = profileDefaults.photoUrl;
    return p;
};

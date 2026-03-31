const jobsGrid = document.getElementById('jobsGrid');
const jobsMeta = document.getElementById('jobsMeta');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const typeFilter = document.getElementById('typeFilter');
const modeFilter = document.getElementById('modeFilter');
const clearFiltersButton = document.getElementById('clearFilters');
const template = document.getElementById('jobCardTemplate');

const metricOpen = document.getElementById('metric-open');
const metricInternship = document.getElementById('metric-internship');
const metricRemote = document.getElementById('metric-remote');
const metricClosed = document.getElementById('metric-closed');

const state = {
    jobs: []
};

const MOTIVATION_LINES = [
    'Great careers are built one disciplined day at a time.',
    'Consistency is a talent multiplier.',
    'Small wins repeated daily become a powerful reputation.',
    'Your next opportunity often hides behind your next effort.',
    'Progress beats perfection in every professional journey.',
    'Skill opens the door, character keeps it open.',
    'Show up prepared, and success starts to recognize you.',
    'Reliability is one of the rarest and most valuable skills.',
    'Curiosity keeps your career future-proof.',
    'Effort with direction always outperforms effort without focus.',
    'The most employable mindset is: learn fast, adapt faster.',
    'Confidence grows where preparation lives.',
    'Discipline makes motivation optional.',
    'Do the work that your future self will thank you for.',
    'A strong portfolio is built by finishing, not just starting.',
    'Excellence is not a moment; it is a method.',
    'Clarity of goals creates clarity of action.',
    'Every challenge is training for a larger role.',
    'Your attitude is part of your skill set.',
    'Keep your standards high and your ego low.',
    'The market rewards people who solve real problems.',
    'Professional growth begins where comfort ends.',
    'One improved habit can change your whole trajectory.',
    'Be the person who can be trusted with important work.',
    'Good communication turns good work into visible impact.',
    'Momentum is earned by doing the next right task.',
    'You do not need perfect conditions to make strong progress.',
    'Difficult tasks are often the fastest path to growth.',
    'Master fundamentals and advanced work gets easier.',
    'A calm mind makes better career decisions.',
    'Your consistency is louder than your intentions.',
    'Learn from feedback without losing your confidence.',
    'Strong teams are built by people who take ownership.',
    'The best professionals make complex things simple.',
    'Your career improves when your standards improve.',
    'Solve one meaningful problem every day.',
    'Execution creates opportunities that planning alone cannot.',
    'Hard skills get interviews, soft skills win careers.',
    'Make your work easy to understand and impossible to ignore.',
    'Focus on value, and visibility will follow.',
    'Preparation turns pressure into performance.',
    'You grow faster when you document what you learn.',
    'Stay humble enough to learn and bold enough to apply.',
    'The habit of finishing is a career superpower.',
    'Results come from systems, not moods.',
    'Build trust first, and leadership opportunities follow.',
    'Every revision makes your craft sharper.',
    'Be patient with outcomes and impatient with effort.',
    'A strong work ethic is always in demand.',
    'Do fewer things, but do them exceptionally well.',
    'Consistency turns potential into proof.',
    'Every interview is easier when your work speaks clearly.',
    'A focused hour beats a distracted day.',
    'Treat deadlines as a promise, not a suggestion.',
    'Resilience is a competitive advantage.',
    'The best time to improve your process is now.',
    'Keep learning, even when no one is asking you to.',
    'Confidence is built by keeping commitments to yourself.',
    'Create value before you ask for recognition.',
    'Your next level starts with better daily choices.',
    'Strong careers are built on credibility and courage.',
    'Excellence loves repetition.',
    'Make each project cleaner than the one before it.',
    'Stay coachable and you will stay relevant.',
    'Progress is quiet before it becomes visible.',
    'Focus on mastery, and titles will follow naturally.',
    'Real growth happens when you take responsibility.',
    'Your reputation is your long-term resume.',
    'Solve for the user, and your work will stand out.',
    'Professional maturity is doing quality work consistently.',
    'Momentum returns when you start, even if imperfectly.',
    'The most reliable route to success is steady improvement.',
    'Be known for quality, speed, and integrity.',
    'Career confidence comes from shipped work.',
    'Start where you are, improve what you can, repeat tomorrow.',
    'Every finished task is evidence of your discipline.',
    'Use setbacks as data, not as identity.',
    'Make learning a daily deliverable.',
    'Your future role is prepared by your current habits.',
    'Choose long-term growth over short-term comfort.',
    'The best professionals ask better questions.',
    'Effort plus reflection equals faster progress.',
    'Do not just be busy; be useful.',
    'A clear process beats random intensity.',
    'Build a career that can survive changing trends.',
    'Keep improving your communication and your craft.',
    'Quality work compounds over time.',
    'When in doubt, ship a better version.',
    'Your discipline today becomes your freedom tomorrow.',
    'Stay accountable, even when no one is watching.',
    'Make it work, then make it better, then make it elegant.',
    'The strongest professionals keep learning in public.',
    'Let your actions introduce your ambition.',
    'Great outcomes begin with clear priorities.',
    'Turn pressure into precision.',
    'The best opportunities come to prepared people.',
    'Build systems that keep you moving on low-energy days.',
    'Keep going; consistency eventually becomes confidence.',
    'Your career is a marathon of meaningful daily wins.',
    'Bring value to every room and you will keep being invited.'
];

function getNextQuoteIndex(total) {
    const storageKey = 'careerQuoteIndex';
    let previousIndex = -1;

    try {
        const savedValue = window.localStorage.getItem(storageKey);
        previousIndex = Number(savedValue);
        if (!Number.isInteger(previousIndex) || previousIndex < 0 || previousIndex >= total) {
            previousIndex = -1;
        }
    } catch (error) {
        previousIndex = -1;
    }

    let newIndex = Math.floor(Math.random() * total);

    if (total > 1 && newIndex === previousIndex) {
        newIndex = (newIndex + 1 + Math.floor(Math.random() * (total - 1))) % total;
    }

    try {
        window.localStorage.setItem(storageKey, String(newIndex));
    } catch (error) {
        // Ignore storage errors and continue with the random selection.
    }

    return newIndex;
}

function renderMotivationQuote() {
    const quoteElement = document.getElementById('motivationQuote');
    const authorElement = document.getElementById('quoteAuthor');

    if (!quoteElement || MOTIVATION_LINES.length === 0) {
        return;
    }

    const firstIndex = getNextQuoteIndex(MOTIVATION_LINES.length);
    let secondIndex = Math.floor(Math.random() * MOTIVATION_LINES.length);

    if (MOTIVATION_LINES.length > 1 && secondIndex === firstIndex) {
        secondIndex = (secondIndex + 1) % MOTIVATION_LINES.length;
    }

    const firstLine = MOTIVATION_LINES[firstIndex];
    const secondLine = MOTIVATION_LINES[secondIndex];
    quoteElement.textContent = `"${firstLine} ${secondLine}"`;

    if (authorElement) {
        authorElement.textContent = 'Virtual Support Group';
    }
}

function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (!navbar) {
            return;
        }

        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function normalize(value) {
    return String(value || '').trim().toLowerCase();
}

function formatDate(isoDate) {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) {
        return 'N/A';
    }

    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function createOption(value, label) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    return option;
}

function populateSelect(select, values, firstLabel) {
    select.innerHTML = '';
    select.appendChild(createOption('all', firstLabel));

    values.forEach((item) => {
        const normalized = normalize(item);
        select.appendChild(createOption(normalized, item));
    });
}

function setSummaryMetrics(jobs) {
    const openJobs = jobs.filter((job) => normalize(job.status) === 'open').length;
    const closedJobs = jobs.filter((job) => normalize(job.status) === 'closed').length;
    const internships = jobs.filter((job) => normalize(job.type).includes('intern')).length;
    const remoteJobs = jobs.filter((job) => normalize(job.workMode).includes('remote')).length;

    metricOpen.textContent = String(openJobs);
    metricClosed.textContent = String(closedJobs);
    metricInternship.textContent = String(internships);
    metricRemote.textContent = String(remoteJobs);
}

function renderListItems(listElement, items) {
    listElement.innerHTML = '';

    if (!Array.isArray(items) || items.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.textContent = 'Not specified';
        listElement.appendChild(emptyItem);
        return;
    }

    items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        listElement.appendChild(li);
    });
}

function buildApplicationTemplate(job) {
    const title = job.title || 'N/A';
    const id = job.id || 'N/A';
    const department = job.department || 'N/A';
    const type = job.type || 'N/A';
    const workMode = job.workMode || 'N/A';
    const location = job.location || 'N/A';

    return [
        'Hi Virtual Support Group Hiring Team,',
        '',
        'I want to apply for the following role:',
        `Job Title: ${title}`,
        `Job ID: ${id}`,
        `Department: ${department}`,
        `Job Type: ${type}`,
        `Work Mode: ${workMode}`,
        `Location: ${location}`,
        '',
        'Applicant Details',
        'Full Name: ',
        'Email: ',
        'Phone / WhatsApp: ',
        'Current Location: ',
        'LinkedIn: ',
        'Portfolio / GitHub: ',
        '',
        'Why I am a good fit',
        '- ',
        '- ',
        '- ',
        '',
        'Availability to start: ',
        'Expected compensation: ',
        '',
        'I have attached my CV/resume.',
        '',
        'Regards,',
        '[Your Name]'
    ].join('\n');
}

function createApplicationLinks(job, emailAddress) {
    const subject = `Application: ${job.title || 'Role'} (${job.id || 'No ID'})`;
    const body = buildApplicationTemplate(job);

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const encodedEmail = encodeURIComponent(emailAddress);

    return {
        mailtoLink: `mailto:${emailAddress}?subject=${encodedSubject}&body=${encodedBody}`,
        gmailComposeLink: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}&su=${encodedSubject}&body=${encodedBody}`
    };
}

function createJobCard(job, index) {
    const clone = template.content.cloneNode(true);

    clone.querySelector('.job-id').textContent = job.id || 'Role ID unavailable';
    clone.querySelector('.job-title').textContent = job.title || 'Untitled role';
    clone.querySelector('.job-description').textContent = job.description || 'No description available.';
    clone.querySelector('.posted-date').textContent = formatDate(job.postedDate);
    clone.querySelector('.experience').textContent = job.experience || 'Not specified';
    clone.querySelector('.compensation').textContent = job.compensation || 'Not specified';
    clone.querySelector('.job-department').textContent = job.department || 'Not specified';

    const status = normalize(job.status) === 'closed' ? 'closed' : 'open';
    const statusText = clone.querySelector('.career-status-pill');
    statusText.textContent = status === 'open' ? 'Open' : 'Closed';
    statusText.classList.add(status);

    const chips = clone.querySelector('.job-tags');
    const chipValues = [
        job.department,
        job.type,
        job.workMode,
        job.location
    ].filter(Boolean);

    chipValues.forEach((chip) => {
        const item = document.createElement('span');
        const normalizedChip = normalize(chip);

        if (normalizedChip.includes('intern')) {
            item.classList.add('chip-internship');
        }

        if (normalizedChip.includes('remote')) {
            item.classList.add('chip-remote');
        }

        if (normalizedChip.includes('full-time') || normalizedChip.includes('full time')) {
            item.classList.add('chip-fulltime');
        }

        if (normalizedChip.includes('contract')) {
            item.classList.add('chip-contract');
        }

        if (normalizedChip.includes('on-site') || normalizedChip.includes('on site')) {
            item.classList.add('chip-onsite');
        }

        item.textContent = chip;
        chips.appendChild(item);
    });

    renderListItems(clone.querySelector('.responsibilities'), job.responsibilities);
    renderListItems(clone.querySelector('.requirements'), job.requirements);

    const applyLink = clone.querySelector('.apply-link');
    const gmailLink = clone.querySelector('.gmail-link');
    const emailAddress = job.applyEmail || 'malikshahzebabd@gmail.com';
    const { mailtoLink, gmailComposeLink } = createApplicationLinks(job, emailAddress);

    if (status === 'closed') {
        applyLink.textContent = 'Position Closed';
        applyLink.classList.remove('btn-primary');
        applyLink.classList.add('btn-secondary');
        applyLink.classList.add('apply-disabled');
        applyLink.setAttribute('aria-disabled', 'true');
        applyLink.removeAttribute('href');

        gmailLink.textContent = 'Gmail Disabled';
        gmailLink.classList.add('disabled');
        gmailLink.removeAttribute('href');
    } else {
        applyLink.textContent = 'Apply Now';
        applyLink.classList.remove('btn-secondary');
        applyLink.classList.add('btn-primary');
        applyLink.classList.remove('apply-disabled');
        applyLink.removeAttribute('aria-disabled');
        applyLink.href = mailtoLink;

        gmailLink.textContent = 'Open in Gmail';
        gmailLink.classList.remove('disabled');
        gmailLink.href = gmailComposeLink;
    }

    const card = clone.querySelector('.career-job-card');
    card.classList.add(status === 'open' ? 'status-open' : 'status-closed');
    card.style.animationDelay = `${Math.min(index * 40, 360)}ms`;

    return clone;
}

function renderJobs(jobs) {
    jobsGrid.innerHTML = '';

    if (jobs.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'job-empty-state';
        empty.textContent = 'No roles match these filters. Try changing status, job type, or work mode.';
        jobsGrid.appendChild(empty);
        return;
    }

    jobs.forEach((job, index) => {
        jobsGrid.appendChild(createJobCard(job, index));
    });
}

function applyFilters() {
    const searchTerm = normalize(searchInput.value);
    const statusValue = normalize(statusFilter.value);
    const typeValue = normalize(typeFilter.value);
    const modeValue = normalize(modeFilter.value);

    const filtered = state.jobs.filter((job) => {
        const roleStatus = normalize(job.status);
        const roleType = normalize(job.type);
        const roleMode = normalize(job.workMode);

        if (statusValue !== 'all' && roleStatus !== statusValue) {
            return false;
        }

        if (typeValue !== 'all' && roleType !== typeValue) {
            return false;
        }

        if (modeValue !== 'all' && roleMode !== modeValue) {
            return false;
        }

        if (!searchTerm) {
            return true;
        }

        const searchBlob = [
            job.id,
            job.title,
            job.department,
            job.location,
            job.workMode,
            job.description,
            job.type,
            job.experience
        ].join(' ');

        return normalize(searchBlob).includes(searchTerm);
    }).sort((a, b) => {
        const aStatusRank = normalize(a.status) === 'open' ? 0 : 1;
        const bStatusRank = normalize(b.status) === 'open' ? 0 : 1;

        if (aStatusRank !== bStatusRank) {
            return aStatusRank - bStatusRank;
        }

        const aTime = new Date(a.postedDate).getTime();
        const bTime = new Date(b.postedDate).getTime();
        return bTime - aTime;
    });

    const openInView = filtered.filter((job) => normalize(job.status) === 'open').length;
    jobsMeta.textContent = `Showing ${filtered.length} of ${state.jobs.length} roles (${openInView} open now)`;
    renderJobs(filtered);
}

function resetFilters() {
    searchInput.value = '';
    statusFilter.value = 'all';
    typeFilter.value = 'all';
    modeFilter.value = 'all';
    applyFilters();
}

async function loadJobs() {
    jobsMeta.textContent = 'Loading jobs...';

    try {
        const response = await fetch('jobs.json', { cache: 'no-store' });

        if (!response.ok) {
            throw new Error(`Unable to load jobs.json: ${response.status}`);
        }

        const payload = await response.json();
        const jobs = Array.isArray(payload.jobs) ? payload.jobs : [];

        if (jobs.length === 0) {
            throw new Error('No jobs found in JSON data.');
        }

        state.jobs = jobs;

        const jobTypes = [...new Set(jobs.map((job) => job.type).filter(Boolean))].sort();
        const workModes = [...new Set(jobs.map((job) => job.workMode).filter(Boolean))].sort();

        populateSelect(typeFilter, jobTypes, 'All job types');
        populateSelect(modeFilter, workModes, 'All work modes');
        setSummaryMetrics(jobs);
        applyFilters();
    } catch (error) {
        jobsGrid.innerHTML = '';
        const errorState = document.createElement('div');
        errorState.className = 'job-error-state';
        errorState.textContent = 'We could not load the jobs feed right now. Please try again soon.';
        jobsGrid.appendChild(errorState);
        jobsMeta.textContent = 'Job feed unavailable';
        console.error(error);
    }
}

searchInput.addEventListener('input', applyFilters);
statusFilter.addEventListener('change', applyFilters);
typeFilter.addEventListener('change', applyFilters);
modeFilter.addEventListener('change', applyFilters);
clearFiltersButton.addEventListener('click', resetFilters);

renderMotivationQuote();
setupNavigation();
loadJobs();

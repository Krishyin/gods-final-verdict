
const card = document.getElementById("card");

let activeTimers = [];
let audioContext = null;
let selectedPreference = "";
let warningCount = 0;

/* =========================
   GENERAL HELPERS
========================= */

function clearTimers() {
    activeTimers.forEach(timer => clearTimeout(timer));
    activeTimers = [];
}

function schedule(callback, delay) {
    const timer = setTimeout(callback, delay);
    activeTimers.push(timer);
    return timer;
}

function render(content) {
    clearTimers();
    card.innerHTML = content;
    card.scrollTop = 0;
}

function button(id, callback) {
    const element = document.getElementById(id);

    if (element) {
        element.addEventListener("click", callback);
    }
}

function progressBar(percent) {
    return `
        <div class="progress-track">
            <div class="progress-fill" style="width:${percent}%"></div>
        </div>
        <p class="progress-label">
            ASSESSMENT PROGRESS · ${percent}%
        </p>
    `;
}

/* =========================
   SOUND EFFECTS
========================= */

function tone(frequency = 440, duration = 0.12, volume = 0.035) {
    try {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;

        if (!audioContext) {
            audioContext = new AudioContextClass();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(volume, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + duration
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
        // Sound is optional.
    }
}

function divineChime() {
    tone(523.25, 0.35, 0.04);
    schedule(() => tone(659.25, 0.4, 0.04), 180);
    schedule(() => tone(783.99, 0.55, 0.035), 360);
}

/* =========================
   WELCOME SCREEN
========================= */

function showWelcome() {
    warningCount = 0;
    selectedPreference = "";

    render(`
        <div class="sigil">✦</div>
        <p class="eyebrow">THE DIVINE ASSESSMENT AUTHORITY</p>
        <h1>WELCOME, PUNITH</h1>
        <div class="rule"></div>

        <p class="question">
            Your presence has been formally requested.
        </p>

        <div class="decree">
            <h2>IMPORTANT NOTICE</h2>
            <p class="description">
                You have been selected for a confidential
                personal assessment. Your cooperation is
                expected throughout this procedure.
            </p>
        </div>

        <p class="status">AUTHORIZATION REQUIRED</p>

        <div class="buttons">
            <button id="welcomeYes">YES, LET'S BEGIN</button>
            <button id="welcomeNo" class="secondary">
                NO, I'M NOT INTERESTED
            </button>
        </div>
    `);

    button("welcomeYes", () => {
        tone(660, 0.15);
        goToFriendQuestion();
    });

    button("welcomeNo", () => {
        tone(180, 0.35, 0.05);

        render(`
            <div class="sigil warning-sigil">⚠</div>
            <p class="eyebrow">SECURITY DEPARTMENT · NOTICE 001</p>
            <h1 class="access-denied">ACCESS DENIED</h1>
            <div class="rule"></div>

            <p class="question">
                Your refusal has been recorded, Punith.
            </p>

            <div class="decree">
                <h2>PROCEDURE INTERRUPTED</h2>
                <p class="description">
                    Your assessment cannot begin until you
                    acknowledge the summons. Return to the
                    beginning and reconsider your decision.
                </p>
            </div>

            <p class="status">RETURN TO INITIAL AUTHORIZATION</p>

            <div class="buttons">
                <button id="returnWelcome">NEXT</button>
            </div>
        `);

        button("returnWelcome", showWelcome);
    });
}

/* =========================
   QUESTION 1
========================= */

function goToFriendQuestion() {
    render(`
        <div class="sigil">✦</div>
        <p class="eyebrow">STAGE 01 · PERSONAL VERIFICATION</p>
        <h1>KNOWLEDGE CHECK</h1>
        ${progressBar(20)}

        <p class="question">
            Punith, do you know Nandish and Pappu?
        </p>

        <p class="description">
            Please provide an accurate response.
        </p>

        <div class="buttons">
            <button id="friendYes">YES, I KNOW THEM</button>
            <button id="friendNo" class="secondary">
                NO, I DON'T KNOW THEM
            </button>
        </div>
    `);

    button("friendYes", () => {
        tone(600, 0.12);
        goToLoveQuestion();
    });

    button("friendNo", showTruthWarning);
}

/* =========================
   TRUTH WARNING
========================= */

function showTruthWarning() {
    warningCount++;
    tone(220, 0.4, 0.05);

    render(`
        <div class="sigil warning-sigil">⚠</div>
        <p class="eyebrow">
            COMPLIANCE DEPARTMENT · WARNING ${warningCount}
        </p>
        <h1 class="access-denied">SERIOUS WARNING</h1>
        <div class="rule"></div>

        <p class="question">
            Punith, are you absolutely sure about that answer?
        </p>

        <div class="decree">
            <h2>TRUTH VERIFICATION REQUIRED</h2>
            <p class="description">
                If you lie during this assessment,
                YOU'LL LOSE YOUR JOB.
            </p>
            <p class="description">
                Review your previous response and provide
                a truthful answer before proceeding.
            </p>
        </div>

        <p class="status">CORRECTION REQUIRED</p>

        <div class="buttons">
            <button id="tellTruth">I'LL TELL THE TRUTH</button>
        </div>
    `);

    button("tellTruth", goToFriendQuestion);
}

/* =========================
   QUESTION 2: DODGING NO
========================= */

function goToLoveQuestion() {
    render(`
        <div class="sigil">✦</div>
        <p class="eyebrow">STAGE 02 · EMOTIONAL EVALUATION</p>
        <h1>PERSONAL DISCLOSURE</h1>
        ${progressBar(40)}

        <p class="question">
            Do you love any of Nandish and Pappu?
        </p>

        <p class="description">
            One answer is expected. Please proceed carefully.
        </p>

        <div class="love-button-area" id="loveButtonArea">
            <button id="loveYes">YES, I DO</button>
            <button id="loveNo" class="secondary">NO, I DON'T</button>
        </div>

        <p class="status">SELECT YOUR ANSWER</p>
    `);

    const area = document.getElementById("loveButtonArea");
    const yesButton = document.getElementById("loveYes");
    const noButton = document.getElementById("loveNo");

    // Both buttons start side by side.
    yesButton.style.position = "absolute";
    yesButton.style.left = "0px";
    yesButton.style.top = "0px";
    yesButton.style.width = "46%";
    yesButton.style.margin = "0";

    noButton.style.position = "absolute";
    noButton.style.left = `${area.clientWidth * 0.54}px`;
    noButton.style.top = "0px";
    noButton.style.width = "42%";
    noButton.style.margin = "0";
    noButton.style.touchAction = "none";

    function moveNoButton(event) {
        if (event) event.preventDefault();

        const maxX = Math.max(
            0,
            area.clientWidth - noButton.offsetWidth
        );

        const maxY = Math.max(
            0,
            area.clientHeight - noButton.offsetHeight
        );

        const oldX = noButton.offsetLeft;
        const oldY = noButton.offsetTop;

        let x = oldX;
        let y = oldY;

        // Try to choose a noticeably different position.
        for (let i = 0; i < 30; i++) {
            x = Math.random() * maxX;
            y = Math.random() * maxY;

            const distance = Math.hypot(
                x - oldX,
                y - oldY
            );

            if (distance > 55) break;
        }

        noButton.style.left = `${x}px`;
        noButton.style.top = `${y}px`;

        tone(420, 0.08, 0.025);
    }

    // Desktop: move when the pointer reaches the button.
    noButton.addEventListener("pointerenter", moveNoButton);

    // Touchscreen: move when the user touches the button.
    noButton.addEventListener("pointerdown", moveNoButton);

    // Prevent the NO button from advancing the assessment.
    noButton.addEventListener("click", event => {
        event.preventDefault();
        moveNoButton(event);
    });

    button("loveYes", () => {
        tone(660, 0.18);
        goToPreferenceQuestion();
    });
}

/* =========================
   QUESTION 3: PREFERENCE
========================= */

function goToPreferenceQuestion() {
    render(`
        <div class="sigil">✦</div>
        <p class="eyebrow">STAGE 03 · FINAL DECLARATION</p>
        <h1>STATE YOUR PREFERENCE</h1>
        ${progressBar(60)}

        <p class="question">
            So, Punith, who do you love?
        </p>

        <p class="description">
            Choose one of the following options.
        </p>

        <div class="buttons">
            <button id="chooseNandish">NANDISH</button>
            <button id="choosePappu">PAPPU</button>
            <button id="chooseBoth">BOTH</button>
            <button id="chooseNeither" class="secondary">
                I LOVE NEITHER
            </button>
        </div>
    `);

    button("chooseNandish", () => recordPreference("Nandish"));
    button("choosePappu", () => recordPreference("Pappu"));
    button("chooseBoth", () => recordPreference("Both"));

    button("chooseNeither", () => {
        tone(220, 0.4, 0.05);

        render(`
            <div class="sigil warning-sigil">⚠</div>
            <p class="eyebrow">FINAL PREFERENCE REVIEW · HR NOTICE</p>
            <h1 class="access-denied">INVALID SELECTION</h1>
            <div class="rule"></div>

            <p class="question">
                Punith, you cannot select this option.
            </p>

            <div class="decree">
                <h2>CHOOSE NANDISH, PAPPU, OR BOTH.</h2>
                <p class="description">
                    You must select one of the available
                    options to proceed. Failure to comply
                    will result in a layoff notice.
                </p>
            </div>

            <p class="status">ALTERNATIVE SELECTION REQUIRED</p>

            <div class="buttons">
                <button id="chooseAgain">RESELECT MY ANSWER</button>
            </div>
        `);

        button("chooseAgain", goToPreferenceQuestion);
    });
}

/* =========================
   CONFIRMATION
========================= */

function recordPreference(preference) {
    selectedPreference = preference;
    tone(620, 0.15);
    goToConfirmation();
}

function goToConfirmation() {
    render(`
        <div class="sigil">✦</div>
        <p class="eyebrow">STAGE 04 · RESPONSE CONFIRMATION</p>
        <h1>FINAL CONFIRMATION</h1>
        ${progressBar(75)}

        <p class="question">
            Punith, confirm your declaration.
        </p>

        <div class="decree">
            <p class="description">Your selected response:</p>
            <h2 class="selected-answer">
                ${selectedPreference.toUpperCase()}
            </h2>
            <p class="description">
                Once confirmed, your response will be
                submitted for divine analysis.
            </p>
        </div>

        <div class="buttons">
            <button id="confirmAnswer">CONFIRM AND PROCEED</button>
            <button id="changeAnswer" class="secondary">
                CHANGE MY ANSWER
            </button>
        </div>
    `);

    button("confirmAnswer", () => {
        tone(700, 0.2);
        startAnalysis();
    });

    button("changeAnswer", goToPreferenceQuestion);
}

/* =========================
   ANALYSIS
========================= */

function startAnalysis() {
    render(`
        <div class="sigil analysis-sigil">✦</div>
        <p class="eyebrow">CENTRAL DIVINE PROCESSING UNIT</p>
        <h1>ANALYSIS IN PROGRESS</h1>
        <div class="rule"></div>

        <p class="question" id="analysisMessage">
            Initializing assessment...
        </p>

        <div class="analysis-meter">
            <div class="analysis-meter-fill" id="analysisFill"></div>
        </div>

        <p class="status" id="analysisStatus">PLEASE WAIT</p>
    `);

    const messages = [
        "Reviewing submitted responses...",
        "Cross-checking personal declarations...",
        "Consulting the divine records...",
        "Requesting final authorization...",
        "Preparing the official verdict..."
    ];

    messages.forEach((messageText, index) => {
        schedule(() => {
            const message = document.getElementById("analysisMessage");
            const fill = document.getElementById("analysisFill");
            const status = document.getElementById("analysisStatus");

            if (message) message.textContent = messageText;

            const percentage = Math.round(
                ((index + 1) / messages.length) * 100
            );

            if (fill) fill.style.width = `${percentage}%`;
            if (status) status.textContent = `PROCESSING · ${percentage}%`;

            tone(450 + index * 70, 0.12, 0.025);
        }, 1200 * (index + 1));
    });

    schedule(showVerdict, 7500);
}

/* =========================
   VERDICT
========================= */

function showVerdict() {
    divineChime();

    render(`
        <div class="sigil verdict-sigil">✦</div>
        <p class="eyebrow">FINAL REPORT · AUTHORIZED DECLARATION</p>
        <h1>OFFICIAL VERDICT</h1>
        <div class="rule"></div>

        <p class="question">
            Punith, the assessment has been completed.
        </p>

        <div class="verdict-panel">
            <p class="verdict-label">DIVINE CLASSIFICATION</p>
            <h2 class="divine-word">YOU ARE A GAY</h2>
            <div class="verdict-line"></div>
            <p class="description">
                This is a divine verdict from the almighty.
            </p>
        </div>

        <p class="status">REPORT GENERATED</p>

        <div class="buttons">
            <button id="viewAdvisory">VIEW DIVINE ADVISORY</button>
        </div>
    `);

    button("viewAdvisory", showMarriageAdvisory);
}

/* =========================
   KULA SAAMI ADVISORY
========================= */

function showMarriageAdvisory() {
    divineChime();

    render(`
        <div class="sigil">ॐ</div>
        <p class="eyebrow">DIVINE COMMUNICATION · PERSONAL ADVISORY</p>
        <h1>A MESSAGE FROM YOUR KULA SAAMI</h1>
        <div class="rule"></div>

        <p class="question">
            Punith, your Kula Saami has an important message.
        </p>

        <div class="decree marriage-decree">
            <p class="verdict-label">DIVINE ADVISORY ISSUED BY</p>
            <h2>VENKATRAMASAAMI</h2>
            <div class="verdict-line"></div>

            <p class="description">
                After reviewing the assessment, the following
                advisory is hereby issued:
            </p>

            <p class="advisory-heading">
                YOU ARE ADVISED TO MARRY
            </p>

            <h2 class="marriage-options">NANDISH</h2>
            <p class="or-text">OR</p>
            <h2 class="marriage-options">PAPPU</h2>
            <p class="or-text">OR EVEN</p>
            <h2 class="marriage-options">BOTH</h2>

            <p class="description">
                Please treat this divine instruction
                with the seriousness it deserves.
            </p>
        </div>

        <p class="status">
            DIVINE ADVISORY PENDING ACKNOWLEDGMENT
        </p>

        <div class="buttons">
            <button id="acknowledgeAdvice">
                ACKNOWLEDGE DIVINE ADVICE
            </button>
        </div>
    `);

    button("acknowledgeAdvice", showCompletion);
}

/* =========================
   COMPLETION
========================= */

function showCompletion() {
    divineChime();

    render(`
        <div class="sigil">✦</div>
        <p class="eyebrow">DIVINE ASSESSMENT AUTHORITY</p>
        <h1>PROCEDURE COMPLETED</h1>
        <div class="rule"></div>

        <p class="question">
            Thank you for your cooperation, Punith.
        </p>

        <div class="decree">
            <h2>ALL STAGES COMPLETED</h2>
            <p class="description">
                Your responses have been recorded, your
                verdict has been issued, and the divine
                advisory has been delivered.
            </p>
        </div>

        <p class="status">SESSION CLOSED</p>

        <div class="buttons">
            <button id="replayExperience">REPLAY EXPERIENCE</button>
        </div>

        <p class="footer-note">
            AUTHORIZED BY YOUR KULA SAAMI, VENKATRAMASAAMI
        </p>
    `);

    button("replayExperience", showWelcome);
}

/* =========================
   START
========================= */

showWelcome();

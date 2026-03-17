import "./home.css";
export default function Home() {
  return (
    <>
      <section class="hero">
        <div class="hero-text">
          <p class="hero-eyebrow">AI-Powered Language Learning</p>
          <h1>
            Practice <em>real</em> conversations in Spanish
          </h1>
          <p class="hero-sub">
            Usu Loqui gives you an AI conversation partner that adapts to your
            level — so you can build fluency through natural dialogue, not rote
            drills.
          </p>
          <div class="hero-cta">
            <a href="#" class="btn-primary">
              Start for free
            </a>
            <a href="#features" class="btn-secondary">
              See how it works
            </a>
          </div>
        </div>

        <div class="hero-visual">
          <div class="chat-mockup">
            <div class="chat-header">
              <div class="chat-avatar">U</div>
              <div class="chat-header-info">
                <strong>Usu Loqui AI</strong>
                <span>Spanish · Intermediate</span>
              </div>
              <div class="online-dot"></div>
            </div>
            <div class="chat-body">
              <div class="bubble ai">¡Hola! ¿Cómo estuvo tu fin de semana?</div>
              <div class="bubble user">
                Fui al mercado y compré muchas verduras.
              </div>
              <div class="bubble ai">
                ¡Qué bien! ¿Y qué vas a cocinar con ellas?
              </div>
              <div class="bubble user">
                Quiero hacer una sopa de pollo con mi familia.
              </div>
              <div class="bubble correction">
                <div class="correction-label">💡 Post-session tip</div>
                "Quiero hacer" is correct here. You could also say{" "}
                <strong>"Me gustaría preparar"</strong> for a more natural
                register.
              </div>
            </div>
            <div class="chat-input-row">
              <input class="chat-input" placeholder="Escribe en español..." />
              <button class="send-btn">➤</button>
            </div>
          </div>
        </div>
      </section>

      <div class="stats-bar">
        <div class="stat">
          <span class="stat-number">3s</span>
          <div class="stat-label">AI response time</div>
        </div>
        <div class="stat">
          <span class="stat-number">6</span>
          <div class="stat-label">Conversation scenarios</div>
        </div>
        <div class="stat">
          <span class="stat-number">3</span>
          <div class="stat-label">Proficiency levels</div>
        </div>
        <div class="stat">
          <span class="stat-number">A1–C2</span>
          <div class="stat-label">CEFR-aligned tracking</div>
        </div>
      </div>

      <section class="features" id="features">
        <h2 class="section-title">Everything you need to improve</h2>
        <p class="section-sub">
          Usu Loqui combines conversational AI with deep learning analytics to
          make every practice session count.
        </p>
        <div class="features-grid">
          <div class="feature-card">
            <div
              class="feature-icon"
              style={{ background: "rgba(196,98,45,0.1);" }}
            ></div>
            <h3>Freeform Conversations</h3>
            <p>
              Chat naturally in Spanish without scripts. The AI adapts its
              vocabulary and complexity to your current proficiency level.
            </p>
          </div>
          <div class="feature-card">
            <div
              class="feature-icon"
              style={{ background: "rgba(122,158,126,0.1);" }}
            ></div>
            <h3>Progress Analytics</h3>
            <p>
              Track your error rate, vocabulary growth, sentence complexity, and
              more with visual dashboards after every session.
            </p>
          </div>
          <div class="feature-card">
            <div
              class="feature-icon"
              style={{ background: "rgba(212,168,67,0.1);" }}
            ></div>
            <h3>Conversation History</h3>
            <p>
              Every chat is saved and annotated. Review past conversations with
              corrections highlighted and vocabulary marked.
            </p>
          </div>
          <div class="feature-card">
            <div
              class="feature-icon"
              style={{ background: "rgba(196,98,45,0.1);" }}
            ></div>
            <h3>NLP Error Detection</h3>
            <p>
              Grammar, semantics, and pragmatics are all analyzed. Get detailed
              feedback reports after each conversation ends.
            </p>
          </div>
          <div class="feature-card">
            <div
              class="feature-icon"
              style={{ background: "rgba(122,158,126,0.1);" }}
            ></div>
            <h3>Scenario Practice</h3>
            <p>
              Choose from dining, travel, business, casual, academic, and
              practical scenarios to practice real-world Spanish.
            </p>
          </div>
          <div class="feature-card">
            <div
              class="feature-icon"
              style={{ background: "rgba(212,168,67,0.1);" }}
            ></div>
            <h3>Instant Translation</h3>
            <p>
              Tap any word or phrase during a conversation to get an instant
              translation without breaking the flow.
            </p>
          </div>
        </div>
      </section>

      <section class="how" id="how">
        <h2 class="section-title">How it works</h2>
        <p class="section-sub">
          Get from sign-up to your first real Spanish conversation in under five
          minutes.
        </p>
        <div class="steps">
          <div class="step">
            <div class="step-number">01</div>
            <h4>Create your account</h4>
            <p>
              Sign up with email and set your Spanish proficiency level to get
              started.
            </p>
          </div>
          <div class="step">
            <div class="step-number">02</div>
            <h4>Pick a scenario</h4>
            <p>
              Choose from dining, travel, business and more — or just start a
              casual free chat.
            </p>
          </div>
          <div class="step">
            <div class="step-number">03</div>
            <h4>Have a conversation</h4>
            <p>
              Chat naturally in Spanish. The AI responds, adjusts, and keeps the
              dialogue flowing.
            </p>
          </div>
          <div class="step">
            <div class="step-number">04</div>
            <h4>Review your feedback</h4>
            <p>
              After each session, read your annotated transcript and see what to
              improve next.
            </p>
          </div>
        </div>
      </section>

      <section class="levels" id="levels">
        <h2 class="section-title">Your level, your pace</h2>
        <p class="section-sub">
          Usu Loqui dynamically adjusts difficulty and tracks your progress
          against internationally recognized CEFR benchmarks.
        </p>
        <div class="levels-grid">
          <div class="level-card beginner">
            <span class="level-badge">Beginner</span>
            <h3>Building the foundation</h3>
            <p>
              Shorter sentences, common vocabulary, and slower pacing. The AI is
              patient and keeps corrections gentle.
            </p>
            <div class="level-cefr">CEFR: A1 — A2</div>
          </div>
          <div class="level-card intermediate">
            <span class="level-badge">Intermediate</span>
            <h3>Growing your fluency</h3>
            <p>
              Full sentences, varied tenses, idiomatic expressions. The AI
              challenges you without overwhelming.
            </p>
            <div class="level-cefr">CEFR: B1 — B2</div>
          </div>
          <div class="level-card advanced">
            <span class="level-badge">Advanced</span>
            <h3>Mastering the nuance</h3>
            <p>
              Complex grammar, cultural register, and subtle pragmatics.
              Conversations feel like talking to a native.
            </p>
            <div class="level-cefr">CEFR: C1 — C2</div>
          </div>
        </div>
      </section>

      <section class="cta-section">
        <h2>
          Ready to start <em>speaking</em>?
        </h2>
        <p>
          Join Usu Loqui and practice Spanish the way it was meant to be —
          through real conversation.
        </p>
        <a href="#" class="btn-primary">
          Create your free account
        </a>
      </section>
    </>
  );
}

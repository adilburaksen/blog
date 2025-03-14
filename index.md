---
layout: layout.njk
title: Home
---

<div class="terminal-welcome">
  <pre class="ascii-art">
 _    _            _    __          ___   _     _     __  __      
| |  | |          | |   \ \        / (_) | |   | |   |  \/  |     
| |__| | __ _  ___| | __ \ \  /\  / / _| | |_  | |__  | \  / | ___ 
|  __  |/ _` |/ __| |/ /  \ \/  \/ / | | | __| | '_ \ | |\/| |/ _ \
| |  | | (_| | (__|   <    \  /\  /  | | | |_  | | | || |  | |  __/
|_|  |_|\__,_|\___|_|\_\    \/  \/   |_|  \__| |_| |_||_|  |_|\___|
  </pre>

  <div class="terminal-session">
    <p><span class="prompt">visitor@hackwith.me:~$</span> whoami</p>
    <p>Welcome to my digital playground! I'm a hacker, developer, and security enthusiast.</p>
    
    <p><span class="prompt">visitor@hackwith.me:~$</span> ls -l /latest-posts</p>
    {% for post in collections.posts | reverse | limit(3) %}
    <p>
      <span class="file-info">-rw-r--r-- 1 root root {{ post.date | date('DD-MM-YYYY') }}</span>
      <a href="{{ post.url }}">{{ post.data.title }}</a>
    </p>
    {% endfor %}
    
    <p><span class="prompt">visitor@hackwith.me:~$</span> cat /etc/interests</p>
    <ul class="interests">
      <li>🔒 Cybersecurity</li>
      <li>💻 Web Development</li>
      <li>🤖 Automation</li>
      <li>🛠️ DevOps</li>
      <li>🔍 Penetration Testing</li>
    </ul>

    <p><span class="prompt">visitor@hackwith.me:~$</span> <span class="cursor">_</span></p>
  </div>
</div>

<style>
.terminal-welcome {
  background: rgba(0, 255, 0, 0.05);
  padding: 20px;
  border-radius: 5px;
  margin: 20px 0;
}

.ascii-art {
  color: var(--text-color);
  font-size: 12px;
  line-height: 1.2;
  margin-bottom: 20px;
  overflow-x: auto;
}

.terminal-session p {
  margin: 10px 0;
}

.file-info {
  color: rgba(0, 255, 0, 0.7);
  margin-right: 10px;
  font-size: 0.9em;
}

.interests {
  list-style: none;
  padding-left: 20px;
  margin: 10px 0;
}

.interests li {
  margin: 5px 0;
  color: var(--text-color);
}
</style>


const SUPABASE_URL = "https://wdbmtwcqhnibtqjoohpx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkYm10d2NxaG5pYnRxam9vaHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MzIxNzMsImV4cCI6MjA3NzEwODE3M30.oDulederjVKKLBoHRbbleb4uIStjMD_3ulyHRneMoyo";


const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let username = localStorage.getItem('username');
if (!username) {
    username = prompt("あなたのニックネームは？");
    localStorage.setItem('username',username);
}

// 🔹 メッセージ送信
document.getElementById("sendBtn").onclick = async () => {
    const message = document.getElementById("message").value;
    await supabase.from("messages").insert([{ username, message }]);
    document.getElementById("message").value = "";
};

// 🔹 初回ロード時に履歴を取得
async function loadMessages() {
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: true });
    data.forEach(addMessage);
}

// 🔹 新メッセージをリアルタイム購読
supabase
    .channel("public:messages")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, payload => {
        addMessage(payload.new);
    })
    .subscribe();

function addMessage(msg) {
    const div = document.createElement("div");
    div.textContent = `[${msg.username}] ${msg.message}`;
    document.getElementById("chat").prevent(div);
}

loadMessages();
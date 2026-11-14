// Holy Bible starter app. Configure Firebase below to enable real account login.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 1) Replace these values with your Firebase project settings (Firebase Console > Project settings).
const firebaseConfig = { apiKey:"YOUR_API_KEY", authDomain:"YOUR_PROJECT.firebaseapp.com", projectId:"YOUR_PROJECT", appId:"YOUR_APP_ID" };
let auth=null;
try { if(firebaseConfig.apiKey!=="YOUR_API_KEY"){auth=getAuth(initializeApp(firebaseConfig));} } catch(e){console.warn("Firebase config not set",e);}

const OT=["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"];
const NT=["Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];
const counts=[50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22];
const all=[...OT,...NT];let currentVerses=[],fontSize=20;
const $=id=>document.getElementById(id),book=$("book"),chapter=$("chapter"),translation=$("translation"),verses=$("verses");
all.forEach((b,i)=>book.add(new Option(b,b)));
book.value="Leviticus";
function fillChapters(){chapter.innerHTML="";let n=counts[all.indexOf(book.value)]||1;for(let i=1;i<=n;i++)chapter.add(new Option(i,i));}
fillChapters();
async function loadChapter(){const b=book.value,c=chapter.value,t=translation.value; $("chapterTitle").textContent=`${b} ${c}`;$("chapterMeta").textContent=`${OT.includes(b)?"Old Testament":"New Testament"} · ${t.toUpperCase()}`;$("progress").textContent=`${all.indexOf(b)+1} / 66 books`;verses.innerHTML='<p class="loading">Loading scripture…</p>';
try{const url=t==="kjv"?`https://bible-api.com/${encodeURIComponent(b)}+${c}?translation=kjv`:`https://bible-api.com/${encodeURIComponent(b)}+${c}?translation=web`;const r=await fetch(url);if(!r.ok)throw Error("Could not load chapter");const data=await r.json();currentVerses=data.verses||[];renderVerses();}catch(e){verses.innerHTML='<p class="loading">Unable to load chapter. Check your internet connection or try another translation.</p>';}}
function renderVerses(){verses.innerHTML="";currentVerses.forEach(v=>{let row=document.createElement("div");row.className="verse";row.innerHTML=`<span class="verse-num">${v.verse}</span><span class="verse-text">${escapeHTML(v.text.trim())}</span><span class="verse-actions"><button title="Save verse" aria-label="Save verse" onclick="saveVerse(${v.verse})">☆</button><button title="Read verse aloud" onclick="speakVerse(${v.verse})">🔊</button></span>`;verses.append(row);});}
function escapeHTML(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
book.addEventListener("change",()=>{fillChapters();loadChapter()});chapter.addEventListener("change",loadChapter);translation.addEventListener("change",loadChapter);
$("prev").onclick=()=>move(-1);$("next").onclick=()=>move(1);function move(d){let bi=all.indexOf(book.value),ci=+chapter.value+d;if(ci<1){if(bi===0)return;book.value=all[bi-1];fillChapters();chapter.value=counts[bi-1];}else if(ci>counts[bi]){if(bi===65)return;book.value=all[bi+1];fillChapters();chapter.value=1;}else chapter.value=ci;loadChapter();}
$("searchBtn").onclick=async()=>{let q=$("searchInput").value.trim();if(!q)return;verses.innerHTML='<p class="loading">Searching…</p>';try{let r=await fetch(`https://bible-api.com/${encodeURIComponent(q)}?translation=${translation.value}`);let d=await r.json();currentVerses=d.verses||[];if(!currentVerses.length){verses.innerHTML=`<p>No exact verse reference found. Try “John 3:16” or search a word below.</p>`;return;} $("chapterTitle").textContent=q;renderVerses();}catch{verses.innerHTML="<p>Search could not be completed. Please check your connection.</p>";}};
$("larger").onclick=()=>{fontSize=Math.min(32,fontSize+2);verses.style.fontSize=fontSize+"px"};$("smaller").onclick=()=>{fontSize=Math.max(14,fontSize-2);verses.style.fontSize=fontSize+"px"};
function speak(text){if(!("speechSynthesis"in window)){alert("Audio reading is not supported in this browser.");return;}speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(text));}
$("readBtn").onclick=()=>speak(currentVerses.map(v=>v.text).join(" "));$("stopBtn").onclick=()=>speechSynthesis?.cancel();window.speakVerse=n=>{let v=currentVerses.find(x=>x.verse===n);if(v)speak(v.text)};window.saveVerse=n=>{let v=currentVerses.find(x=>x.verse===n);let arr=JSON.parse(localStorage.getItem("savedVerses")||"[]");arr.push(`${$("chapterTitle").textContent}:${n} — ${v.text.trim()}`);localStorage.setItem("savedVerses",JSON.stringify(arr));alert("Verse saved in this browser.");};
$("themeBtn").onclick=()=>document.body.classList.toggle("light");
$("saveNote").onclick=()=>{localStorage.setItem("bibleNote", $("notes").value);$("noteStatus").textContent=" Reflection saved ✓";};$("notes").value=localStorage.getItem("bibleNote")||"";
const modal=$("authModal");$("loginBtn").onclick=()=>modal.classList.remove("hidden");$("closeModal").onclick=()=>modal.classList.add("hidden");$("logoutBtn").onclick=()=>auth&&signOut(auth);
async function authAction(signup){$("authMessage").textContent="";if(!auth){$("authMessage").textContent="Set up Firebase first: add your config in app.js and enable Email/Password sign-in.";return;}try{let email=$("email").value,password=$("password").value;signup?await createUserWithEmailAndPassword(auth,email,password):await signInWithEmailAndPassword(auth,email,password);modal.classList.add("hidden");}catch(e){$("authMessage").textContent=e.message;}}
$("emailLogin").onclick=()=>authAction(false);$("emailSignup").onclick=()=>authAction(true);
if(auth)onAuthStateChanged(auth,u=>{$("loginBtn").classList.toggle("hidden",!!u);$("logoutBtn").classList.toggle("hidden",!u);$("heroStatus").textContent=u?`Signed in as ${u.email}. Your reading journey starts here.`:"A quiet place to read, search, and reflect on God's Word.";});
loadChapter();
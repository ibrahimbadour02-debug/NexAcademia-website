/* ---------- Google Analytics 4 ----------
   Add your GA4 Measurement ID (G-XXXXXXXXXX) in assets/content.js.
   This loader then enables analytics across every page automatically.
*/
(function initNexaAnalytics(){
  const id = (window.NEXA && window.NEXA.gaMeasurementId || "").trim();
  window.trackNexa = function(eventName, params){
    if (typeof window.gtag === "function") window.gtag("event", eventName, params || {});
  };
  if (!/^G-[A-Z0-9]+$/i.test(id)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ dataLayer.push(arguments); };
  gtag("js", new Date());
  gtag("config", id, { anonymize_ip: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  document.head.appendChild(script);
})();


document.addEventListener("DOMContentLoaded",()=>{
 const c=window.NEXA||{};document.querySelectorAll("[data-business]").forEach(e=>e.textContent=c.businessName||"NexAcademia");document.querySelectorAll("[data-tagline]").forEach(e=>e.textContent=c.tagline||"");document.querySelectorAll("[data-phone]").forEach(e=>{e.textContent=c.phone||"";if(e.tagName==="A")e.href="tel:"+(c.phone||"").replace(/\s/g,"")});document.querySelectorAll("[data-location]").forEach(e=>e.textContent=c.location||"");
 const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&x.target.classList.add("visible")),{threshold:.12});document.querySelectorAll(".reveal").forEach(e=>io.observe(e));
 document.querySelectorAll(".faq-q").forEach(b=>b.addEventListener("click",()=>b.closest(".faq-item").classList.toggle("open")));
 const m=document.getElementById("enquiryModal");document.querySelectorAll("[data-open-enquiry]").forEach(b=>b.addEventListener("click",e=>{e.preventDefault();m?.classList.add("open")}));document.querySelectorAll("[data-close-modal]").forEach(b=>b.addEventListener("click",()=>m?.classList.remove("open")));m?.addEventListener("click",e=>{if(e.target===m)m.classList.remove("open")});
 const qs=[{q:"Who needs support?",o:["Primary school student","Secondary school student"]},{q:"What is the main need right now?",o:["Falling behind","Homework / schoolwork support","Assessment or exam preparation","Extension / stronger results"]},{q:"What matters most to your family?",o:["Flexible timetable","Broad subject support","Experienced teachers","Clear parent updates"]}];let qi=0,a=[];const q=document.getElementById("quizQuestion"),opts=document.getElementById("quizOptions"),bar=document.getElementById("quizBar"),res=document.getElementById("quizResult");function render(){if(!q||!opts)return;if(qi>=qs.length){const s=a[0]?.includes("Primary")?"Primary":"Secondary";q.textContent="Your recommended starting point";opts.innerHTML="";bar.style.width="100%";res.classList.remove("hidden");res.innerHTML=`<strong>${s} consultation</strong><br>A flexible ${s.toLowerCase()} plan focused on ${(a[1]||"general support").toLowerCase()} is a sensible starting point.<br><br><button class="btn btn-primary" id="quizEnquire">Enquire about this</button>`;window.trackNexa?.("support_finder_complete",{recommended_stream:s});document.getElementById("quizEnquire")?.addEventListener("click",()=>m?.classList.add("open"));return}q.textContent=qs[qi].q;opts.innerHTML="";qs[qi].o.forEach(x=>{const b=document.createElement("button");b.className="quiz-option";b.textContent=x;b.onclick=()=>{a.push(x);qi++;render()};opts.appendChild(b)});bar.style.width=(qi/qs.length*100)+"%"}render();
 document.getElementById("checkAnswer")?.addEventListener("click",()=>{const v=(document.getElementById("challengeAnswer")?.value||"").trim(),f=document.getElementById("challengeFeedback");if(v==="24"){f.textContent="Correct — ¾ of 32 is 24. Nice work.";f.style.color="#11865F";window.trackNexa?.("student_challenge_correct",{challenge:"three_quarters_of_32"})}else{f.textContent="Not quite. Try 32 ÷ 4 = 8, then 8 × 3 = 24.";f.style.color="#B34C36"}});
 let si=0;const slides=[...document.querySelectorAll(".slide")];function show(n){if(!slides.length)return;si=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle("active",i===si))}document.getElementById("prevSlide")?.addEventListener("click",()=>show(si-1));document.getElementById("nextSlide")?.addEventListener("click",()=>show(si+1));if(slides.length)setInterval(()=>show(si+1),6500);

 /* Analytics events for actions that matter */
 document.querySelectorAll("[data-open-enquiry]").forEach(el=>{
   el.addEventListener("click",()=>window.trackNexa?.("open_enquiry",{location:window.location.pathname}));
 });
 document.querySelectorAll("a[href^='tel:']").forEach(el=>{
   el.addEventListener("click",()=>window.trackNexa?.("click_phone",{location:window.location.pathname}));
 });
 document.querySelectorAll("a[href='primary.html']").forEach(el=>{
   el.addEventListener("click",()=>window.trackNexa?.("select_pathway",{pathway:"primary"}));
 });
 document.querySelectorAll("a[href='secondary.html']").forEach(el=>{
   el.addEventListener("click",()=>window.trackNexa?.("select_pathway",{pathway:"secondary"}));
 });
 document.querySelectorAll(".nexa-enquiry-form").forEach(form=>{
   form.addEventListener("submit",async (event)=>{
     event.preventDefault();
     window.trackNexa?.("enquiry_submit_attempt",{form_name:"nexacademia-enquiry"});

     const formId=(window.NEXA?.formspreeFormId||"").trim();
     let status=form.querySelector(".form-status");
     if(!status){
       status=document.createElement("p");
       status.className="form-status small";
       status.setAttribute("aria-live","polite");
       const submitWrap=form.querySelector('button[type="submit"]')?.parentElement;
       if(submitWrap) submitWrap.appendChild(status);
       else form.appendChild(status);
     }

     if(!/^[A-Za-z0-9]+$/.test(formId)){
       status.textContent="Online enquiries are still being configured. Please call 0416 268 034 for now.";
       status.style.color="#B34C36";
       return;
     }

     const button=form.querySelector('button[type="submit"]');
     const originalText=button?.textContent||"Send Enquiry";
     if(button){
       button.disabled=true;
       button.textContent="Sending...";
     }
     status.textContent="";

     try{
       const response=await fetch("https://formspree.io/f/"+encodeURIComponent(formId),{
         method:"POST",
         body:new FormData(form),
         headers:{"Accept":"application/json"}
       });

       if(response.ok){
         window.location.href="thank-you.html";
         return;
       }

       let message="Sorry, your enquiry could not be sent. Please try again or call 0416 268 034.";
       try{
         const data=await response.json();
         if(data?.errors?.length){
           message=data.errors.map(e=>e.message).filter(Boolean).join(" ")||message;
         }
       }catch(_){}
       status.textContent=message;
       status.style.color="#B34C36";
     }catch(_){
       status.textContent="Sorry, your enquiry could not be sent. Please check your connection or call 0416 268 034.";
       status.style.color="#B34C36";
     }finally{
       if(button){
         button.disabled=false;
         button.textContent=originalText;
       }
     }
   });
 });
 if(document.body.dataset.page==="thank-you"){
   window.trackNexa?.("generate_lead",{method:"Formspree"});
 }
});

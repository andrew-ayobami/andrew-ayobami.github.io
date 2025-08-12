/* === Config & Data loading === */
const DATA_SRC = 'data.json'; // replace with your data file

let dataset = [];
let currentSortDesc = true;
const countriesToInclude = [
  "US","China","Russia","Israel","UK","France","Turkey","India","UAE","Taiwan"
];

/* Helper: build country filter dropdown + buttons */
function populateCountryControls(uniqueCountries) {
  const sel = document.getElementById('countryFilter');
  uniqueCountries.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  });
  const btnContainer = document.getElementById('countryButtons');
  uniqueCountries.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.textContent = c;
    btn.dataset.country = c;
    btn.onclick = () => {
      document.getElementById('countryFilter').value = c;
      applyFilters();
      btn.classList.add('chip--active');
      setTimeout(()=>btn.classList.remove('chip--active'), 600);
    };
    btnContainer.appendChild(btn);
  });
}

/* Render table/cards */
function renderCards(dataArr) {
  const container = document.getElementById('cards');
  container.innerHTML = '';
  if (!dataArr.length) {
    container.innerHTML = '<p class="empty">No incidents match your search.</p>';
    return;
  }
  dataArr.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-head">
        <h3 class="card-title">${escapeHtml(item.project)} <span class="tag">${escapeHtml(item.country)}</span></h3>
        <div class="card-year">${escapeHtml(String(item.year))}</div>
      </div>
      <p class="card-desc">${escapeHtml(item.summary)}</p>
      <div class="card-footer">
        <div class="card-tags">${item.tags.map(t=>`<span class="pill">${escapeHtml(t)}</span>`).join(' ')}</div>
        <button class="btn small" data-id="${escapeHtml(item.id)}">View details</button>
      </div>
    `;
    // animate
    card.style.animationDelay = Math.min(0.05 * container.children.length, 0.5) + 's';
    container.appendChild(card);
  });
  // attach listeners
  document.querySelectorAll('.card .btn').forEach(b => {
    b.addEventListener('click', e => {
      const id = e.currentTarget.dataset.id;
      const item = dataset.find(d => d.id === id);
      if (item) showModal(item);
    });
  });
}

/* Modal */
function showModal(item) {
  document.getElementById('modal').setAttribute('aria-hidden','false');
  document.getElementById('modalTitle').textContent = item.project + ' [DEMO DATA]';
  document.getElementById('modalMeta').textContent = `${item.country} • ${item.year} • ${item.use_case}`;
  document.getElementById('modalSummary').textContent = item.description;
  const srcDiv = document.getElementById('modalSources'); srcDiv.innerHTML = '<h4>Sources</h4>';
  item.sources.forEach(s => {
    const a = document.createElement('a');
    a.href = s.url || '#';
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = `${s.title} (${s.type || 'source'})`;
    srcDiv.appendChild(a);
  });
  document.getElementById('modalPolicy').textContent = item.policy_note || '';
  document.getElementById('modalConfidence').textContent = 'Confidence: '+(item.confidence || 'demo');
  document.getElementById('modalBackdrop').classList.add('visible');
  document.querySelector('.modal-panel').classList.add('in');
}
function closeModal() {
  document.getElementById('modal').setAttribute('aria-hidden','true');
  document.getElementById('modalBackdrop').classList.remove('visible');
  document.querySelector('.modal-panel').classList.remove('in');
}

/* Filters & Search */
function applyFilters() {
  const search = document.getElementById('searchBox').value.toLowerCase().trim();
  const country = document.getElementById('countryFilter').value;
  let out = dataset.filter(d => {
    if (country && d.country !== country) return false;
    if (!search) return true;
    const hay = (d.project + ' ' + d.summary + ' ' + d.description + ' ' + (d.vendor_model||'')).toLowerCase();
    return hay.includes(search);
  });
  renderCards(out);
}

/* Utility */
function escapeHtml(s){ if(!s && s!==0) return ''; return String(s).replace(/[&<>"'`=\/]/g, function(ch){ return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;' })[ch]; }); }

/* Sorting */
function sortDataByYearDesc(toggle=true) {
  dataset.sort((a,b)=> {
    const diff = (b.year||0) - (a.year||0);
    return currentSortDesc ? diff : -diff;
  });
  currentSortDesc = !currentSortDesc;
}

/* Init: load data.json then setup controls */
fetch(DATA_SRC)
  .then(r=> r.json())
  .then(json => {
    // filter to only included countries (in case of extra)
    dataset = json.filter(d => countriesToInclude.includes(d.country));
    // sort by year desc
    dataset.sort((a,b)=>(b.year||0)-(a.year||0));
    // populate country controls (unique)
    const unique = [...new Set(dataset.map(d=>d.country))].sort();
    populateCountryControls(unique);
    renderCards(dataset);
  })
  .catch(err => {
    console.error('Failed to load data', err);
    document.getElementById('cards').innerHTML = '<p class="empty">Failed to load data.json</p>';
  });

/* UI events */
document.getElementById('searchBox').addEventListener('input', debounce(applyFilters, 250));
document.getElementById('countryFilter').addEventListener('change', applyFilters);
document.getElementById('sortBtn').addEventListener('click', ()=> {
  currentSortDesc = !currentSortDesc;
  dataset.reverse();
  renderCards(dataset);
});
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('modalBackdrop').addEventListener('click', closeModal);

/* small debounce util */
function debounce(fn, ms) {
  let t;
  return function(...a) { clearTimeout(t); t = setTimeout(()=>fn.apply(this,a), ms); };
}
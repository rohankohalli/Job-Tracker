const API_URL = 'http://localhost:8000/api';

const btnExtract = document.getElementById('btn-extract');
const spinnerExtract = document.getElementById('spinner-extract');
const editForm = document.getElementById('edit-form');
const captureSection = document.getElementById('capture-section');

const inputTitle = document.getElementById('input-title');
const inputCompany = document.getElementById('input-company');
const inputUrl = document.getElementById('input-url');
const inputDescription = document.getElementById('input-description');

const btnSave = document.getElementById('btn-save');
const spinnerSave = document.getElementById('spinner-save');
const btnReset = document.getElementById('btn-reset');

const alertSuccess = document.getElementById('alert-success');
const alertError = document.getElementById('alert-error');

function showAlert(element, message) {
  element.innerText = message;
  element.style.display = 'block';
  setTimeout(() => {
    element.style.display = 'none';
  }, 5000);
}

function hideAlerts() {
  alertSuccess.style.display = 'none';
  alertError.style.display = 'none';
}

btnExtract.addEventListener('click', async () => {
  btnExtract.disabled = true;
  spinnerExtract.style.display = 'inline-block';
  hideAlerts();

  try {
    // 1. Query active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      throw new Error('No active browser tab found.');
    }

    inputUrl.value = tab.url || '';

    // 2. Inject scripting function to grab innerText of body
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText,
    });

    if (!result || !result.trim()) {
      throw new Error('Could not extract text content from the active tab.');
    }

    // 3. Post raw text to backend parsing endpoint
    const response = await fetch(`${API_URL}/jobs/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: result }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to parse job description.');
    }

    const data = await response.json();

    // 4. Populate form
    inputTitle.value = data.title || '';
    inputCompany.value = data.company || '';
    if (data.description) {
      inputDescription.value = data.description;
    } else {
      inputDescription.value = result.slice(0, 1000) + '...';
    }

    // Show form
    editForm.style.display = 'block';
    captureSection.style.display = 'none';
  } catch (err) {
    showAlert(alertError, err.message);
  } finally {
    btnExtract.disabled = false;
    spinnerExtract.style.display = 'none';
  }
});

btnSave.addEventListener('click', async () => {
  const title = inputTitle.value.trim();
  const company = inputCompany.value.trim();
  const url = inputUrl.value.trim();
  const description = inputDescription.value.trim();

  if (!title || !company) {
    showAlert(alertError, 'Job Title and Company are required.');
    return;
  }

  btnSave.disabled = true;
  spinnerSave.style.display = 'inline-block';
  hideAlerts();

  try {
    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, company, url, description }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to save job opportunity.');
    }

    showAlert(alertSuccess, 'Job opportunity successfully saved to your tracker!');

    // Reset view
    setTimeout(() => {
      resetForm();
    }, 1500);
  } catch (err) {
    showAlert(alertError, err.message);
  } finally {
    btnSave.disabled = false;
    spinnerSave.style.display = 'none';
  }
});

btnReset.addEventListener('click', resetForm);

function resetForm() {
  inputTitle.value = '';
  inputCompany.value = '';
  inputUrl.value = '';
  inputDescription.value = '';
  editForm.style.display = 'none';
  captureSection.style.display = 'block';
  hideAlerts();
}

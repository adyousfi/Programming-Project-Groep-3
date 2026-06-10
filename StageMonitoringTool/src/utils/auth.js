export async function logout() {
  try {
    await fetch('/logout', {
      method: 'POST',
      credentials: 'include'
    });
  } catch (err) {
    console.error('Fout bij uitloggen:', err);
  } finally {
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  }
}

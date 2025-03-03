import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect} from 'react';
import ImagePreview from './components/ImagePreview';
import ImageInput from './components/inputs/ImageInput';

export default function Settings() {
  const { data: session, status } = useSession();
  const [successMessage, setSuccessMessage] = useState('');
  // Rename the state variable to avoid conflict with the prop
  const [siteSettings, setSiteSettings] = useState({});
  const [loading, setLoading] = useState(true);

  async function fetchSettings() {
    try {
      const response = await fetch('/api/getSiteSettings');
      const data = await response.json();
      if (response.ok) {
        setSiteSettings(data.settings[0] || {});
      } else {
        console.error('Failed to fetch site settings:', data.error);
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
    } finally {
      setLoading(false);
    }
  }

  // Use useEffect to call fetchSettings when session or status changes
  useEffect(() => {
    if (session) {
      fetchSettings();
    } else if (status !== 'loading') {
      // Redirect to sign-in page if user is not authenticated
      signIn();
    }
  }, [session, status]);

  if (loading) {
    return <div>Loading...</div>;
  }

async function handleSubmit() {
  try {
    const response = await fetch('/api/saveSiteSettings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(siteSettings),
    });

    const data = await response.json();
    if (response.ok) {

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Show success message
      setSuccessMessage('Settings saved successfully!');

      // Optionally, clear the message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000); // Adjust delay as needed

    } else {
      console.error('Failed to save settings:', data.error);
    }
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}
  async function handleLandingPhotoUpload({ url, position }) {
    setSiteSettings((prev) => ({ ...prev, [`landingPhoto${position}`]: url }));
  }

  async function handleAboutPhotoUpload({ url, position }) {
    setSiteSettings((prev) => ({ ...prev, [`aboutPhoto${position}`]: url }));
  }

  function handleSlideShowIntervalChange(e) {
    const value = e.target.value;
    setSiteSettings((prev) => ({ ...prev, slideShowInterval: value }));
  }


  function handleAboutSlideShowIntervalChange(e) {
    const value = e.target.value;
    setSiteSettings((prev) => ({ ...prev, aboutSlideShowInterval: value }));
  }

  function handleAboutBlurbChange(e) {
    const value = e.target.value;
    setSiteSettings((prev) => ({ ...prev, aboutBlurb: value }));
  }
  function handleLandingCaptionChange(e) {
    const value = e.target.value;
    setSiteSettings((prev) => ({ ...prev, landingCaption: value }));
  }

  function handleReplacePhoto(position) {
    setSiteSettings((prev) => ({ ...prev, [`landingPhoto${position}`]: '' }));
  }
  function handleReplaceAboutPhoto(position) {
    setSiteSettings((prev) => ({ ...prev, [`aboutPhoto${position}`]: '' }));
  }

  if (!session) {
    return <p>Redirecting to sign-in...</p>;
  }
  return(
    <>
    {successMessage !=='' &&
      <>
        <div className='success-message'>
          {successMessage}
        </div>
      </>
    }
      
      <div className="mb-12 space-y-12">
        {/* Home Page Slideshow Section */}
        <section>
          <h2 className="text-3xl font-semibold text-center mb-4 roaming-black-text top-padding-md">Home Page Slideshow</h2>
          <div className="text-center">
            <label className="block roaming-black-text mb-2">Slide Show Interval:</label>
            <input
              type="number"
              className="block mx-auto p-3 border border-gray-300 rounded-md roaming-black-text mb-6 w-64"
              value={siteSettings.slideShowInterval || ''}
              onChange={handleSlideShowIntervalChange}
              placeholder="Interval (in seconds)"
            />
          </div>

          <div className="flex justify-center flex-wrap gap-6 mt-6">
            {['1', '2', '3'].map((position) => (
              <div key={position} className="bg-white p-4 rounded-lg shadow-lg text-center">
                {siteSettings[`landingPhoto${position}`] === '' ? (
                  <ImageInput onImageUpload={(url) => handleLandingPhotoUpload({ url, position })} />
                ) : (
                  <ImagePreview
                    imageUrl={siteSettings[`landingPhoto${position}`]}
                    classes="object-cover rounded-md mb-4"
                    width="360"
                    height="220"
                  />
                )}
                <button
                  onClick={() => handleReplacePhoto(position)}
                  className="text-blue-600 hover:underline"
                >
                  Replace
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* About Blurb Slideshow Section */}
        <section>
          <h2 className="text-3xl font-semibold text-center mb-4 roaming-black-text">About Blurb Slideshow</h2>
          <div className="text-center">
            <label className="block roaming-black-text mb-2">Slide Show Interval:</label>
            <input
              type="number"
              className="block mx-auto p-3 border border-gray-300 rounded-md roaming-black-text mb-6 w-64"
              value={siteSettings.aboutSlideShowInterval || ''}
              onChange={handleAboutSlideShowIntervalChange}
              placeholder="Interval (in seconds)"
            />
          </div>

          <div className="flex justify-center flex-wrap gap-6 mt-6">
            {['1', '2', '3'].map((position) => (
              <div key={position} className="bg-white p-4 rounded-lg shadow-lg text-center">
                {siteSettings[`aboutPhoto${position}`] === '' ? (
                  <ImageInput onImageUpload={(url) => handleAboutPhotoUpload({ url, position })} />
                ) : (
                  <ImagePreview
                    imageUrl={siteSettings[`aboutPhoto${position}`]}
                    classes="object-cover rounded-md mb-4"
                    width="360"
                    height="220"
                  />
                )}
                <button
                  onClick={() => handleReplaceAboutPhoto(position)}
                  className="text-blue-600 hover:underline"
                >
                  Replace
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Text Area Section */}
        <section>
          <div className="text-center">
            <label className="block mb-2 roaming-black-text">Landing Caption:</label>
            <textarea
              className="block mx-auto p-4 border border-gray-300 rounded-md roaming-black-text w-5/6 resize-none"
              value={siteSettings.landingCaption || ''}
              onChange={handleLandingCaptionChange}
              placeholder="Landing Caption..."
              rows="4"
            />
          </div>

          <div className="text-center mt-8">
            <label className="block mb-2 roaming-black-text">About Blurb:</label>
            <textarea
              className="block mx-auto p-4 border border-gray-300 rounded-md roaming-black-text w-5/6 resize-none"
              value={siteSettings.aboutBlurb || ''}
              onChange={handleAboutBlurbChange}
              placeholder="About blurb..."
              rows="4"
            />
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-center mt-10 bottom-padding-lg">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition "
          >
            Save Settings
          </button>
        </div>
      </div>
    </>
  )
}
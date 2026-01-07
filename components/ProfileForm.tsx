import React, { useState } from 'react';

interface ProfileFormProps {
  onProfileComplete: (profile: any) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onProfileComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/upload-profile-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        onProfileComplete(data.profile);
      } else {
        alert("נכשלנו בניתוח התמונה: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("שגיאת תקשורת עם השרת");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
      <h2 className="text-3xl font-bold text-stone-800 mb-4">בואי נכיר אותך! 🍌</h2>
      <p className="text-stone-600 mb-6">העלי תמונה מלאה (מכף רגל ועד ראש) כדי שננו בננה יוכל ללמוד את הסטייל שלך.</p>
      
      <div className="border-2 border-dashed border-pink-200 rounded-xl p-6 mb-6 hover:bg-pink-50 transition-colors">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="hidden" 
          id="photo-upload"
        />
        <label htmlFor="photo-upload" className="cursor-pointer block">
          {file ? (
            <span className="text-pink-600 font-medium">{file.name} נבחרה!</span>
          ) : (
            <span className="text-stone-400">לחצי כאן לבחירת תמונה</span>
          )}
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!file || isAnalyzing}
        className={`w-full py-3 rounded-full font-bold text-white transition-all ${
          isAnalyzing ? 'bg-stone-400' : 'bg-pink-500 hover:bg-pink-600 shadow-lg hover:shadow-pink-200'
        }`}
      >
        {isAnalyzing ? 'ננו בננה מנתח...' : 'צרי את הסטייל DNA שלי'}
      </button>
    </div>
  );
};
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import api from '@/utils/api';
import { toast } from 'sonner';
import { FileText, Eye, Upload, AlertCircle, X, Loader2 } from 'lucide-react';

const ComposeStep = ({ data, updateData, nextStep, prevStep }) => {
  const [content, setContent] = useState(data.adContent || '');
  const [showPreview, setShowPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(data.adImage || '');

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  }, [content]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
    updateData({ adContent: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imageUrl = response.data.url;
      setUploadedImage(imageUrl);
      updateData({ adImage: imageUrl });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setUploadedImage('');
    updateData({ adImage: '' });
  };

  const handleNext = () => {
    if (!content.trim()) {
      toast.error('Please enter your ad content');
      return;
    }
    if (wordCount < 5) {
      toast.error('Ad content must be at least 5 words');
      return;
    }
    nextStep();
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Compose Your Advertisement</h2>
      <p className="text-gray-600 mb-6 sm:mb-8">Enter the content for your {data.adType}</p>

      <div className="max-w-3xl space-y-6">
        {/* Ad Content */}
        <div>
          <Label className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Ad Content *
          </Label>
          <Textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Enter your advertisement text here...\n\nExample for Matrimonial:\nWanted a suitable match for our son, 28 years, Software Engineer, earning 15 LPA. Preferably from educated family. Contact: 9876543210"
            className="min-h-[200px] text-base border-2"
            data-testid="ad-content-input"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-600">Word Count: <strong>{wordCount}</strong></span>
            {data.pricePerWord > 0 && (
              <span className="text-sm text-orange-600 font-semibold">
                Estimated: ₹{(data.basePrice + (wordCount * data.pricePerWord)).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Image Upload (Optional) */}
        {(data.adType === 'Classified Display' || data.adType === 'Display Ad') && (
          <div>
            <Label className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Logo/Image (Optional)
            </Label>
            
            {!uploadedImage ? (
              <label className="border-2 border-dashed border-gray-300 p-8 text-center hover:border-orange-400 transition-colors cursor-pointer block">
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-3" />
                    <p className="text-sm text-gray-600">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  data-testid="image-upload-input"
                />
              </label>
            ) : (
              <div className="relative border-2 border-gray-300 p-4">
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
                <img src={uploadedImage} alt="Uploaded" className="max-h-48 mx-auto" />
                <p className="text-sm text-center text-green-600 mt-2">✓ Image uploaded successfully</p>
              </div>
            )}
          </div>
        )}

        {/* Preview */}
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="mb-3"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
          
          {showPreview && (
            <div className="border-2 border-gray-300 p-6 bg-gray-50">
              <div className="bg-white p-4 border border-gray-200">
                <div className="text-xs font-bold text-gray-500 mb-2 uppercase">{data.category}</div>
                <div className="text-sm whitespace-pre-wrap">{content || 'Your ad preview will appear here...'}</div>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Tips for better ads:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Keep it concise and clear</li>
              <li>Include contact information</li>
              <li>Mention key details upfront</li>
              <li>Avoid spelling mistakes</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <Button onClick={prevStep} variant="outline" size="lg">Back</Button>
        <Button onClick={handleNext} size="lg" className="bg-orange-500 hover:bg-orange-600" data-testid="next-button">Continue</Button>
      </div>
    </div>
  );
};

export default ComposeStep;

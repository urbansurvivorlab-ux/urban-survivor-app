import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Baby, Activity, Dog, Home, ChevronRight, UserCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useAppContext } from '../context/AppContext';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { state, setProfile } = useAppContext();
  const [formData, setFormData] = useState({
    familySize: state.profile.familySize.toString(),
    children: state.profile.children.toString(),
    elderly: state.profile.elderly.toString(),
    pets: state.profile.pets,
    housingType: state.profile.housingType,
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      familySize: parseInt(formData.familySize, 10),
      children: parseInt(formData.children, 10),
      elderly: parseInt(formData.elderly, 10),
      pets: formData.pets,
      housingType: formData.housingType,
    });
    navigate('/diagnosis');
  };

  return (
    <div className="animate-fade-in py-6">
      <div className="mb-8 text-center">
        <div className="inline-flex bg-white/5 p-3 rounded-xl mb-4 text-survivor-primary">
          <UserCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">世帯情報の設定</h2>
        <p className="text-survivor-muted text-sm px-4">
          診断精度を高め、あなたに最適な備蓄量とアクションを算出するために世帯状況を教えてください。
        </p>
      </div>

      <Card className="max-w-md mx-auto relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-survivor-primary/10 blur-3xl rounded-full" />
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-4">
            {/* Field: Family Size */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
              <div className="text-survivor-muted bg-white/5 p-2 rounded-lg">
                <Users size={20} />
              </div>
              <div className="flex-grow">
                <label className="block text-sm font-medium text-white mb-1">世帯人数</label>
                <select 
                  name="familySize" 
                  value={formData.familySize} 
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-survivor-primary transition-colors"
                >
                  {[1,2,3,4,5,6].map(num => <option key={num} value={num}>{num}人</option>)}
                </select>
              </div>
            </div>

            {/* Field: Children */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
              <div className="text-survivor-muted bg-white/5 p-2 rounded-lg">
                <Baby size={20} />
              </div>
              <div className="flex-grow">
                <label className="block text-sm font-medium text-white mb-1">子供の人数（12歳以下）</label>
                <select 
                  name="children" 
                  value={formData.children} 
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-survivor-primary transition-colors"
                >
                  {[0,1,2,3,4].map(num => <option key={num} value={num}>{num}人</option>)}
                </select>
              </div>
            </div>

            {/* Field: Elderly */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
              <div className="text-survivor-muted bg-white/5 p-2 rounded-lg">
                <Activity size={20} />
              </div>
              <div className="flex-grow">
                <label className="block text-sm font-medium text-white mb-1">高齢者の人数（65歳以上）</label>
                <select 
                  name="elderly" 
                  value={formData.elderly} 
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-survivor-primary transition-colors"
                >
                  {[0,1,2,3,4].map(num => <option key={num} value={num}>{num}人</option>)}
                </select>
              </div>
            </div>

            {/* Field: Pets */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
              <div className="text-survivor-muted bg-white/5 p-2 rounded-lg">
                <Dog size={20} />
              </div>
              <div className="flex-grow">
                <label className="block text-sm font-medium text-white mb-1">ペット</label>
                <select 
                  name="pets" 
                  value={formData.pets} 
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-survivor-primary transition-colors"
                >
                  <option value="0">なし</option>
                  <option value="犬">犬</option>
                  <option value="猫">猫</option>
                  <option value="その他">その他</option>
                </select>
              </div>
            </div>

            {/* Field: Housing info (simplified) */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-survivor-muted mb-1 flex items-center gap-1"><Home size={12}/> 住居</label>
              <select name="housingType" value={formData.housingType} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm">
                <option value="マンション">マンション</option>
                <option value="戸建て">戸建て</option>
              </select>
            </div>

          </div>

          <div className="pt-6">
            <Button type="submit" variant="primary" fullWidth>
              <span className="font-bold">設定して診断へ進む</span>
              <ChevronRight size={20} />
            </Button>
          </div>
        </form>
      </Card>
      
      {/* Step Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        <div className="w-2 h-2 rounded-full bg-survivor-primary"></div>
        <div className="w-2 h-2 rounded-full bg-white/20"></div>
        <div className="w-2 h-2 rounded-full bg-white/20"></div>
      </div>
    </div>
  );
};

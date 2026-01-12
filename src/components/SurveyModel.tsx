import React, { useState } from 'react';
import './styles/surveyModel.css';

interface PublishOption {
  isPublic: boolean;
  isAnonymous: boolean;
}

interface SurveyModalProps {
  onCancel?: () => void;
  onConfirm?: (option: PublishOption) => void;
}

const SurveyModal: React.FC<SurveyModalProps> = ({ onCancel, onConfirm }) => {
  const [selectedOption, setSelectedOption] = useState<string>('익명');

  const getPublishOption = (option: string): PublishOption => {
    switch (option) {
      case '비공개':
        return { isPublic: false, isAnonymous: false };
      case '익명':
        return { isPublic: true, isAnonymous: true };
      case '실명':
        return { isPublic: true, isAnonymous: false };
      default:
        return { isPublic: true, isAnonymous: true };
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(getPublishOption(selectedOption));
    }
  };

  return (
    <div className="survey-overlay">
      <div className="survey-modal">
        <div className="survey-header">1:1 문의 채팅 종료</div>
        
        <div className="survey-question">
          게시판에 등록하시겠습니까?
        </div>

        <div className="survey-options">
          <label className="option-label">
            <input
              type="radio"
              name="publish"
              value="비공개"
              checked={selectedOption === '비공개'}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            <span className="option-text">비공개</span>
          </label>

          <label className="option-label">
            <input
              type="radio"
              name="publish"
              value="익명"
              checked={selectedOption === '익명'}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            <span className="option-text">익명</span>
          </label>

          <label className="option-label">
            <input
              type="radio"
              name="publish"
              value="실명"
              checked={selectedOption === '실명'}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            <span className="option-text">실명</span>
          </label>
        </div>

        <div className="survey-footer">
          <span className="page-indicator">2건</span>
        </div>

        <div className="survey-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            취소
          </button>
          <button className="btn-confirm" onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyModal;
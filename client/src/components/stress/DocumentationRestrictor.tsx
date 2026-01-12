/* eslint-disable max-lines-per-function */
/**
 * DocumentationRestrictor Component - Progressive Stress System
 * Restricts documentation access based on stress level
 */

import React, { useState, useEffect } from 'react';
import { BookOpen, Lock, ExternalLink, AlertCircle } from 'lucide-react';
import { ProgressiveStressService } from '../../services/progressiveStress';

interface DocumentationRestrictorProps {
  sessionId: string;
  onAccessBlocked?: (url: string) => void;
  className?: string;
}

export const DocumentationRestrictor: React.FC<DocumentationRestrictorProps> = ({
  sessionId,
  onAccessBlocked,
  className = ''
}) => {
  const [allowedUrls, setAllowedUrls] = useState<string[]>([]);
  const [blockedAttempts, setBlockedAttempts] = useState<string[]>([]);
  const [showBlocked, setShowBlocked] = useState(false);

  const stressService = ProgressiveStressService.getInstance();

  useEffect(() => {
    const urls = stressService.getAllowedDocumentationUrls(sessionId);
    setAllowedUrls(urls);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Intercept external link clicks
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href && target.href.startsWith('http')) {
        const url = new URL(target.href);
        const domain = url.hostname.toLowerCase();

        const isAllowed = allowedUrls.some(allowedUrl =>
          domain.includes(allowedUrl.toLowerCase()) ||
          allowedUrl.includes(domain)
        );

        if (!isAllowed) {
          event.preventDefault();
          setBlockedAttempts(prev => [...prev, target.href]);
          setShowBlocked(true);
          onAccessBlocked?.(target.href);

          stressService.recordStressEvent(sessionId, {
            type: 'documentation_blocked',
            message: `Documentation access blocked: ${domain}`,
            severity: 'high',
            resolved: false
          });
        }
      }
    };

    document.addEventListener('click', handleLinkClick, true);
    return () => document.removeEventListener('click', handleLinkClick, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedUrls, sessionId, onAccessBlocked]);

  const getDocumentationLevel = () => {
    const session = stressService.getSessionStatus(sessionId);
    return session?.documentationLevel || 'full';
  };

  const getLevelDescription = () => {
    const level = getDocumentationLevel();
    switch (level) {
      case 'full':
        return 'Full documentation access available';
      case 'core':
        return 'Core documentation only - reference docs restricted';
      case 'minimal':
        return 'Minimal documentation - concepts only';
      case 'none':
        return 'No external documentation allowed';
      default:
        return 'Documentation access available';
    }
  };

  const getLevelColor = () => {
    const level = getDocumentationLevel();
    switch (level) {
      case 'none':
        return 'text-red-400 border-red-500 bg-red-900/20';
      case 'minimal':
        return 'text-orange-400 border-orange-500 bg-orange-900/20';
      case 'core':
        return 'text-yellow-400 border-yellow-500 bg-yellow-900/20';
      default:
        return 'text-green-400 border-green-500 bg-green-900/20';
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getLevelColor()} ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {getDocumentationLevel() === 'none' ? (
          <Lock className="w-5 h-5" />
        ) : (
          <BookOpen className="w-5 h-5" />
        )}
        <span className="font-semibold">Documentation Access: {getDocumentationLevel().toUpperCase()}</span>
      </div>

      <p className="text-sm mb-3">{getLevelDescription()}</p>

      {allowedUrls.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium mb-1">Allowed Domains:</h4>
          <div className="flex flex-wrap gap-1">
            {allowedUrls.map((url) => (
              <span key={url} className="px-2 py-1 bg-black/30 rounded text-xs">
                {url}
              </span>
            ))}
          </div>
        </div>
      )}

      {blockedAttempts.length > 0 && (
        <div className="mb-3">
          <button
            onClick={() => setShowBlocked(!showBlocked)}
            className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
          >
            <AlertCircle className="w-4 h-4" />
            {blockedAttempts.length} blocked access attempt{blockedAttempts.length === 1 ? '' : 's'}
          </button>

          {showBlocked && (
            <div className="mt-2 max-h-32 overflow-y-auto">
              {blockedAttempts.map((url) => (
                <div key={url} className="flex items-center gap-2 text-xs text-red-300 py-1">
                  <ExternalLink className="w-3 h-3" />
                  <span className="truncate">{url}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-400">
        External documentation links will be blocked if not in the allowed list.
      </div>
    </div>
  );
};

export default DocumentationRestrictor;
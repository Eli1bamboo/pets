"use client";

import { Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/features/customer/components/atoms/Button';
import { useTranslation } from '@/i18n/LanguageContext';

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    details?: string;
}

export function Modal({ open, onClose, title, message, type = 'info', details, onConfirm, confirmText, cancelText }: ModalProps) {
    const { t } = useTranslation();
    const displayConfirmText = confirmText || t.common.confirm;
    const displayCancelText = cancelText || t.common.cancel;
    const displayUnderstoodText = t.common.understood;

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle className="h-6 w-6 text-green-600" />;
            case 'error': return <AlertTriangle className="h-6 w-6 text-red-600" />;
            case 'warning': return <AlertTriangle className="h-6 w-6 text-orange-600" />;
            default: return <Info className="h-6 w-6 text-blue-600" />;
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success': return 'border-green-100 bg-green-50';
            case 'error': return 'border-red-100 bg-red-50';
            case 'warning': return 'border-orange-100 bg-orange-50';
            default: return 'border-blue-100 bg-blue-50';
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-xl border ${getColor()}`}>
                                        {getIcon()}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 leading-6">
                                            {title}
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                {message}
                                            </p>
                                        </div>
                                        {details && (
                                            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <p className="text-xs text-gray-500 font-mono break-all">
                                                    {details}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                                {onConfirm ? (
                                    <>
                                        <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
                                            {displayCancelText}
                                        </Button>
                                        <Button
                                            onClick={() => { onConfirm(); onClose(); }}
                                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white border-transparent"
                                        >
                                            {displayConfirmText}
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
                                        {displayUnderstoodText}
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

import { describe, it, expect } from 'vitest';
import { cn } from '../../lib/utils';

describe('cn utility', () => {
    it('merges class names correctly', () => {
        expect(cn('c-1', 'c-2')).toBe('c-1 c-2');
    });

    it('resolves tailwind conflicts', () => {
        // px-2 should be overridden by px-4
        expect(cn('px-2', 'px-4')).toBe('px-4');
        // text-red-500 overridden by text-blue-500
        expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('handles conditional classes', () => {
        expect(cn('c-1', true && 'c-2', false && 'c-3')).toBe('c-1 c-2');
    });

    it('handles undefined/null inputs', () => {
        expect(cn('c-1', undefined, null)).toBe('c-1');
    });
});

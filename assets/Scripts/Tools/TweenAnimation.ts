import { _decorator, Node, tween, TweenEasing, Vec3, Quat, Sprite, Color } from 'cc';

export class TweenAnimation {
    
    public static moveTo(node: Node, worldPosition: Vec3, time: number = 0.1, easing: TweenEasing = 'sineOut', onComplete?: () => void): void {  
        this.stopPositionTween(node);         
        const newTween = tween(node)
            .to(time, { worldPosition }, { easing })
            .call(() => {
                if (onComplete) {
                    onComplete();
                }
                this.clearPositionTweens(node);
            });
        if (!node['__positionTweens']) {
            node['__positionTweens'] = [];
        }
        node['__positionTweens'].push(newTween);
        newTween.start();
    }

    public static rotateTo(node: Node, worldRotation: Quat, time: number = 0.1, easing: TweenEasing = 'sineOut', onComplete?: () => void,): void {
        this.stopRotationTween(node);
        const newTween = tween(node)
            .to(time, { worldRotation }, { easing })
            .call(() => {
                if (onComplete) {
                    onComplete();
                }
                this.clearRotationTweens(node);
            });
        if (!node['__rotationTweens']) {
            node['__rotationTweens'] = [];
        }
        node['__rotationTweens'].push(newTween);
        newTween.start();
    }


    public static scaleTo(node: Node, worldScale: Vec3, time: number = 0.1, easing: TweenEasing = 'sineOut', onComplete?: () => void,): void {   
        this.stopScaleTween(node);    
        const newTween = tween(node)
            .to(time, { worldScale }, { easing })
            .call(() => {
                if (onComplete) {
                    onComplete();
                }
                this.clearScaleTweens(node);
            });
        if (!node['__scaleTweens']) {
            node['__scaleTweens'] = [];
        }
        node['__scaleTweens'].push(newTween);      
        newTween.start();
    }

    public static fadeTo(sprite: Sprite, opacity: number, time: number = 0.1, easing: TweenEasing = 'sineOut', onComplete?: () => void): void {
        this.stopFadeTween(sprite);
        const startOpacity = sprite.color.a;
        const newTween = tween({ opacity: startOpacity })
            .to(time, { opacity }, {
                easing,
                onUpdate: (target: { opacity: number }) => {
                    const color = sprite.color;
                    sprite.color = new Color(color.r, color.g, color.b, target.opacity);
                }
            })
            .call(() => {
                if (onComplete) {
                    onComplete();
                }
                this.clearFadeTweens(sprite);
            });
        if (!sprite['__fadeTweens']) {
            sprite['__fadeTweens'] = [];
        }
        sprite['__fadeTweens'].push(newTween);
        newTween.start();
    }

    public static stopPositionTween(node: Node): void {
        if (node['__positionTweens']) {
            for (const positionTween of node['__positionTweens']) {
                positionTween.stop();
            }
            this.clearPositionTweens(node);
        }
    }

    public static stopRotationTween(node: Node): void {
        if (node['__rotationTweens']) {
            for (const rotationTween of node['__rotationTweens']) {
                rotationTween.stop();
            }
            this.clearRotationTweens(node);
        }
    }

    public static stopScaleTween(node: Node): void {
        if (node['__scaleTweens']) {
            for (const scaleTween of node['__scaleTweens']) {
                scaleTween.stop();
            }
            this.clearScaleTweens(node);
        }
    } 

     public static stopFadeTween(sprite: Sprite): void {
        if (sprite['__fadeTweens']) {
            for (const fadeTween of sprite['__fadeTweens']) {
                fadeTween.stop();
            }
            this.clearFadeTweens(sprite);
        }
    }

    public static stopAllTweens(node: Node): void {
        this.stopPositionTween(node);
        this.stopRotationTween(node);
        this.stopScaleTween(node);
        const sprite = node.getComponent(Sprite);
        if (sprite){
            this.stopFadeTween(sprite);
        }
    }

    private static clearPositionTweens(node: Node): void {
        node['__positionTweens'] = [];
    }

    private static clearRotationTweens(node: Node): void {
        node['__rotationTweens'] = [];
    }

    private static clearScaleTweens(node: Node): void {
        node['__scaleTweens'] = [];
    }

    private static clearFadeTweens(sprite: Sprite): void {
        sprite['__fadeTweens'] = [];
    }
}
